import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

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
        const uploadsSnap = await adminDb.collection('uploads')
            .where('event_id', '==', eventId)
            .get();

        const unanalyzedUploads = uploadsSnap.docs.filter(doc => !doc.data().ai_tags || doc.data().ai_tags.length === 0);

        if (unanalyzedUploads.length === 0) {
            return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
        }

        // Generate demo tags based on file type
        const demoTags: Record<string, string[]> = {
            photo: ['event', 'people', 'celebration', 'indoor', 'photography'],
            video: ['event', 'video', 'motion', 'celebration'],
        }

        let analyzed = 0;
        const batch = adminDb.batch();

        for (const uploadDoc of unanalyzedUploads) {
            const upload = uploadDoc.data();
            const fileType = upload.file_type || 'photo';
            const baseTags = demoTags[fileType] || demoTags.photo;
            // Randomly pick 2-4 tags to make filtering interesting
            const shuffled = [...baseTags].sort(() => 0.5 - Math.random());
            const tags = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));

            batch.update(uploadDoc.ref, { ai_tags: tags });
            analyzed++;
        }

        await batch.commit();

        return Response.json({
            analyzed,
            message: `Demo tags applied to ${analyzed} uploads. Set real Google Vision credentials for actual AI analysis.`,
        })
    }

    // ── Real Vision API analysis ───────────────────────────────────────
    const uploadsSnap = await adminDb.collection('uploads')
        .where('event_id', '==', eventId)
        .get();

    const unanalyzedUploads = uploadsSnap.docs.filter(doc => !doc.data().ai_tags || doc.data().ai_tags.length === 0);

    if (unanalyzedUploads.length === 0) {
        return Response.json({ analyzed: 0, message: 'All uploads already analyzed' })
    }

    const visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`

    let analyzed = 0
    let failed = 0

    // Batch processing limits depending on scale - doing sequentially for now
    for (const uploadDoc of unanalyzedUploads) {
        const upload = uploadDoc.data();

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

            await uploadDoc.ref.update({ ai_tags: labels });
            analyzed++
        } catch {
            failed++
        }
    }

    return Response.json({ analyzed, failed, total: unanalyzedUploads.length })
}
