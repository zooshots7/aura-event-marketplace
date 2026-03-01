import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// POST /api/analyze-uploads
// Uses Gemini AI (official SDK) to analyze images and generate descriptive tags.
// ---------------------------------------------------------------------------

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const BATCH_SIZE = 3                     // concurrent analyses
const MAX_RETRIES = 2

// Schema that forces Gemini to return a valid JSON array of strings
const tagsSchema = {
    type: SchemaType.ARRAY as const,
    items: { type: SchemaType.STRING as const },
    description: 'Array of 5-10 lowercase descriptive tags for the image',
}

const ANALYSIS_PROMPT = `You are an expert image tagger for event photography. Analyze this image and return 5-10 descriptive tags.

Rules:
- Tags must be lowercase single words or short 2-word phrases
- Focus on: people count (solo/couple/group/crowd), actions (dancing/eating/talking/posing), setting (indoor/outdoor/stage/table), mood (happy/energetic/romantic/candid), lighting (daylight/evening/neon/spotlight), and notable objects
- Be specific: prefer "group selfie" over "photo", prefer "dance floor" over "event"
- Do NOT include generic tags like "image" or "photo" or "picture"`

async function analyzeWithRetry(
    model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
    base64: string,
    mimeType: string,
    retries = MAX_RETRIES,
): Promise<string[]> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType,
                        data: base64,
                    },
                },
                { text: ANALYSIS_PROMPT },
            ])

            const text = result.response.text()
            const tags: string[] = JSON.parse(text)
                .map((t: string) => String(t).toLowerCase().trim())
                .filter((t: string) => t.length > 0 && t.length < 40)
                .slice(0, 10)

            if (tags.length > 0) return tags
            return ['untagged']
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown'
            console.error(`[analyze] Attempt ${attempt + 1}/${retries + 1} failed: ${msg}`)

            if (attempt < retries) {
                // Exponential backoff: 1s, 2s
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
            } else {
                throw err
            }
        }
    }
    return ['untagged']
}

export async function POST(request: NextRequest) {
    const { eventId } = (await request.json()) as { eventId?: string }

    if (!eventId) {
        return Response.json({ error: 'eventId is required' }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY

    if (!geminiKey) {
        // Fallback: generate demo tags so the UI still works
        return await applyDemoTags(eventId)
    }

    // ── Initialize Gemini SDK ────────────────────────────────────────────
    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 256,
            responseMimeType: 'application/json',
            responseSchema: tagsSchema,
        },
    })

    // ── Fetch un-analyzed uploads ────────────────────────────────────────
    let uploadsSnap
    try {
        uploadsSnap = await adminDb.collection('uploads')
            .where('event_id', '==', eventId)
            .get()
    } catch (err: unknown) {
        console.error('Firebase error:', err)
        return Response.json({ error: 'Database connection error' }, { status: 500 })
    }

    const unanalyzedUploads = uploadsSnap.docs.filter(
        doc => !doc.data().ai_tags || doc.data().ai_tags.length === 0
    )

    if (unanalyzedUploads.length === 0) {
        return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
    }

    // ── Analyze with Gemini (batched) ────────────────────────────────────
    let analyzed = 0
    let failed = 0
    let skipped = 0

    // Process in batches of BATCH_SIZE
    for (let i = 0; i < unanalyzedUploads.length; i += BATCH_SIZE) {
        const batch = unanalyzedUploads.slice(i, i + BATCH_SIZE)

        const results = await Promise.allSettled(
            batch.map(async (uploadDoc) => {
                const upload = uploadDoc.data()

                // Skip videos — give them default tags
                if (upload.file_type === 'video') {
                    const videoTags = ['video', 'event', 'motion', 'recording']
                    await uploadDoc.ref.update({ ai_tags: videoTags })
                    return { id: uploadDoc.id, status: 'video' as const }
                }

                // Fetch the image
                const imgRes = await fetch(upload.file_url)
                if (!imgRes.ok) {
                    throw new Error(`Failed to fetch image: HTTP ${imgRes.status}`)
                }

                const buffer = await imgRes.arrayBuffer()

                // Skip oversized images
                if (buffer.byteLength > MAX_IMAGE_SIZE) {
                    console.warn(`[analyze] Skipping ${uploadDoc.id}: image too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB)`)
                    await uploadDoc.ref.update({ ai_tags: ['large-image', 'untagged'] })
                    return { id: uploadDoc.id, status: 'skipped' as const }
                }

                const base64 = Buffer.from(buffer).toString('base64')
                const mimeType = imgRes.headers.get('content-type') || 'image/jpeg'

                // Analyze with Gemini (with retries)
                const tags = await analyzeWithRetry(model, base64, mimeType)

                await uploadDoc.ref.update({ ai_tags: tags })
                console.log(`[analyze] Tagged upload ${uploadDoc.id}: ${tags.join(', ')}`)
                return { id: uploadDoc.id, status: 'analyzed' as const, tags }
            })
        )

        for (const result of results) {
            if (result.status === 'fulfilled') {
                const val = result.value
                if (val.status === 'analyzed' || val.status === 'video') {
                    analyzed++
                } else if (val.status === 'skipped') {
                    skipped++
                }
            } else {
                failed++
                console.error(`[analyze] Failed:`, result.reason)
            }
        }
    }

    return Response.json({
        analyzed,
        failed,
        skipped,
        total: unanalyzedUploads.length,
        message: `Analyzed ${analyzed} uploads with Gemini AI${skipped > 0 ? ` (${skipped} skipped)` : ''}${failed > 0 ? ` (${failed} failed)` : ''}`,
    })
}

// ---------------------------------------------------------------------------
// Fallback: demo tags when no API key is configured
// ---------------------------------------------------------------------------
async function applyDemoTags(eventId: string) {
    const uploadsSnap = await adminDb.collection('uploads')
        .where('event_id', '==', eventId)
        .get()

    const unanalyzed = uploadsSnap.docs.filter(
        doc => !doc.data().ai_tags || doc.data().ai_tags.length === 0
    )

    if (unanalyzed.length === 0) {
        return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
    }

    const demoTags: Record<string, string[]> = {
        photo: ['event', 'people', 'celebration', 'indoor', 'photography'],
        video: ['event', 'video', 'motion', 'celebration'],
    }

    let analyzed = 0
    const batch = adminDb.batch()

    for (const uploadDoc of unanalyzed) {
        const upload = uploadDoc.data()
        const fileType = upload.file_type || 'photo'
        const baseTags = demoTags[fileType] || demoTags.photo
        const shuffled = [...baseTags].sort(() => 0.5 - Math.random())
        const tags = shuffled.slice(0, 2 + Math.floor(Math.random() * 3))
        batch.update(uploadDoc.ref, { ai_tags: tags })
        analyzed++
    }

    await batch.commit()

    return Response.json({
        analyzed,
        message: `Demo tags applied to ${analyzed} uploads. Set GEMINI_API_KEY for real AI analysis.`,
    })
}
