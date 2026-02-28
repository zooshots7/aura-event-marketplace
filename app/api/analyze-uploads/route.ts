import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// POST /api/analyze-uploads
// Uses Gemini API to analyze images and generate descriptive tags.
// ---------------------------------------------------------------------------

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

    // ── Analyze with Gemini ──────────────────────────────────────────────
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`

    let analyzed = 0
    let failed = 0

    for (const uploadDoc of unanalyzedUploads) {
        const upload = uploadDoc.data()

        // Skip videos for now — Gemini works best with images
        if (upload.file_type === 'video') {
            const videoTags = ['video', 'event', 'motion', 'recording']
            await uploadDoc.ref.update({ ai_tags: videoTags })
            analyzed++
            continue
        }

        try {
            // Fetch the image and convert to base64
            const imgRes = await fetch(upload.file_url)
            if (!imgRes.ok) throw new Error(`Failed to fetch image: HTTP ${imgRes.status}`)

            const buffer = await imgRes.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            const mimeType = imgRes.headers.get('content-type') || 'image/jpeg'

            // Call Gemini API
            const geminiBody = {
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType,
                                data: base64,
                            },
                        },
                        {
                            text: 'Analyze this image and return ONLY a JSON array of 5-10 descriptive tags (lowercase single words or short phrases). Focus on: subjects, actions, setting, mood, colors. Example: ["portrait","smiling","outdoor","sunny","group photo","celebration"]. Return ONLY the JSON array, nothing else.',
                        },
                    ],
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 200,
                },
            }

            const res = await fetch(geminiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiBody),
            })

            if (!res.ok) {
                const errBody = await res.text()
                console.error(`Gemini API error for upload ${uploadDoc.id}:`, errBody)
                failed++
                continue
            }

            const result = await res.json()
            const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text || ''

            // Parse the tags from Gemini's response
            let tags: string[] = []
            try {
                // Extract JSON array from response (handle markdown code blocks)
                const jsonMatch = textContent.match(/\[[\s\S]*?\]/)
                if (jsonMatch) {
                    tags = JSON.parse(jsonMatch[0])
                        .map((t: string) => t.toLowerCase().trim())
                        .filter((t: string) => t.length > 0)
                }
            } catch {
                // If parsing fails, split by common delimiters
                tags = textContent
                    .replace(/[\[\]"']/g, '')
                    .split(/[,\n]/)
                    .map((t: string) => t.toLowerCase().trim())
                    .filter((t: string) => t.length > 0 && t.length < 30)
                    .slice(0, 10)
            }

            if (tags.length === 0) {
                tags = ['untagged']
            }

            await uploadDoc.ref.update({ ai_tags: tags })
            analyzed++
            console.log(`[analyze] Tagged upload ${uploadDoc.id}: ${tags.join(', ')}`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown'
            console.error(`[analyze] Failed for upload ${uploadDoc.id}:`, message)
            failed++
        }
    }

    return Response.json({
        analyzed,
        failed,
        total: unanalyzedUploads.length,
        message: `Analyzed ${analyzed} uploads with Gemini AI`,
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
