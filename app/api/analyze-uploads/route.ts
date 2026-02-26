import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// POST /api/analyze-uploads
// Runs Google Cloud Vision label detection on un-tagged uploads for an event.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
    const { eventId } = (await request.json()) as { eventId?: string }

    if (!eventId) {
        return Response.json({ error: 'eventId is required' }, { status: 400 })
    }

    // Check credentials
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const visionKey = process.env.GOOGLE_CLOUD_VISION_KEY

    if (
        !visionKey ||
        !projectId ||
        visionKey === 'your_vision_api_key' ||
        projectId === 'your_project_id'
    ) {
        // Gracefully skip — generate placeholder tags so the UI still works
        const { data: uploads } = await supabaseAdmin
            .from('uploads')
            .select('id, file_type')
            .eq('event_id', eventId)
            .is('ai_tags', null)

        if (!uploads || uploads.length === 0) {
            return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
        }

        // Generate demo tags based on file type
        const demoTags: Record<string, string[]> = {
            photo: ['event', 'people', 'celebration', 'indoor', 'photography'],
            video: ['event', 'video', 'motion', 'celebration'],
        }

        let analyzed = 0
        for (const upload of uploads) {
            const baseTags = demoTags[upload.file_type] || demoTags.photo
            // Randomly pick 2-4 tags to make filtering interesting
            const shuffled = [...baseTags].sort(() => 0.5 - Math.random())
            const tags = shuffled.slice(0, 2 + Math.floor(Math.random() * 3))

            await supabaseAdmin
                .from('uploads')
                .update({ ai_tags: tags })
                .eq('id', upload.id)

            analyzed++
        }

        return Response.json({
            analyzed,
            message: `Demo tags applied to ${analyzed} uploads. Set real Google Vision credentials for actual AI analysis.`,
        })
    }

    // ── Real Vision API analysis ───────────────────────────────────────
    const { data: uploads } = await supabaseAdmin
        .from('uploads')
        .select('id, file_url')
        .eq('event_id', eventId)
        .is('ai_tags', null)

    if (!uploads || uploads.length === 0) {
        return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
    }

    const visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`

    let analyzed = 0
    let failed = 0

    for (const upload of uploads) {
        try {
            const visionBody = {
                requests: [
                    {
                        image: { source: { imageUri: upload.file_url } },
                        features: [
                            { type: 'LABEL_DETECTION', maxResults: 10 },
                        ],
                    },
                ],
            }

            const res = await fetch(visionEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visionBody),
            })

            if (!res.ok) {
                failed++
                continue
            }

            const result = await res.json()
            const labels =
                result.responses?.[0]?.labelAnnotations?.map(
                    (l: { description: string }) => l.description.toLowerCase(),
                ) || []

            await supabaseAdmin
                .from('uploads')
                .update({ ai_tags: labels })
                .eq('id', upload.id)

            analyzed++
        } catch {
            failed++
        }
    }

    return Response.json({ analyzed, failed, total: uploads.length })
}
