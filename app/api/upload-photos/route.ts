import { NextRequest } from 'next/server'
import { adminDb, adminStorage } from '@/lib/firebase-admin'
import { nanoid } from 'nanoid'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const eventId = formData.get('eventId') as string

        if (!eventId) {
            return Response.json({ error: 'eventId is required' }, { status: 400 })
        }

        // Ensure event exists
        let eventDoc
        try {
            eventDoc = await adminDb.collection('events').doc(eventId).get()
        } catch (dbErr: unknown) {
            console.error('Firebase Admin error:', dbErr)
            return Response.json(
                { error: 'Database connection error. Check server config.' },
                { status: 500 },
            )
        }

        if (!eventDoc.exists) {
            return Response.json({ error: 'Event not found' }, { status: 404 })
        }

        const uploaderId = eventDoc.data()?.created_by || null

        // Collect all files from the form
        const files: File[] = []
        for (const [key, value] of formData.entries()) {
            if (key === 'files' && value instanceof File) {
                files.push(value)
            }
        }

        if (files.length === 0) {
            return Response.json({ error: 'No files provided' }, { status: 400 })
        }

        console.log(`[upload] Starting upload of ${files.length} files for event ${eventId}`)

        const results: { fileName: string; success: boolean; error?: string }[] = []

        for (const file of files) {
            try {
                const buffer = await file.arrayBuffer()
                if (buffer.byteLength === 0) {
                    results.push({ fileName: file.name, success: false, error: 'Empty file' })
                    continue
                }

                const fileId = nanoid()
                const ext = file.type.startsWith('video/') ? 'mp4' : file.name.split('.').pop() || 'jpg'
                const storagePath = `events/${eventId}/${fileId}.${ext}`

                const bucket = adminStorage.bucket()
                const storageFile = bucket.file(storagePath)

                await storageFile.save(Buffer.from(buffer), {
                    metadata: {
                        contentType: file.type || 'image/jpeg',
                    },
                })

                await storageFile.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

                await adminDb.collection('uploads').add({
                    event_id: eventId,
                    uploaded_by: uploaderId,
                    file_type: file.type.startsWith('video/') ? 'video' : 'photo',
                    file_url: publicUrl,
                    file_size: buffer.byteLength,
                    created_at: new Date().toISOString(),
                    metadata: {
                        source: 'direct-upload',
                        original_name: file.name,
                    },
                })

                console.log(`[upload] Uploaded: ${file.name} -> ${storagePath}`)
                results.push({ fileName: file.name, success: true })
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                console.error(`[upload] Failed: ${file.name}:`, message)
                results.push({ fileName: file.name, success: false, error: message })
            }
        }

        const imported = results.filter(r => r.success).length
        const failed = results.filter(r => !r.success).length

        return Response.json({ imported, failed, total: files.length, results })
    } catch (err: unknown) {
        console.error('Upload API error:', err)
        const message = err instanceof Error ? err.message : 'Internal server error'
        return Response.json({ error: message }, { status: 500 })
    }
}
