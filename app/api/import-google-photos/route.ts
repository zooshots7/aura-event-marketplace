import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { nanoid } from 'nanoid'

// Google Photos album scraper — no API key required
import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch'

export const maxDuration = 300 // allow up to 5 min for large albums
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidAlbumUrl(url: string): boolean {
    try {
        const u = new URL(url)
        return (
            u.hostname === 'photos.app.goo.gl' ||
            u.hostname === 'photos.google.com'
        )
    } catch {
        return false
    }
}

function mimeForUrl(url: string): string {
    // Google Photos urls are almost always JPEG; if the url contains
    // "=m18" or similar motion-photo/video indicators treat as video.
    if (/=m(18|37)/.test(url)) return 'video/mp4'
    return 'image/jpeg'
}

// ---------------------------------------------------------------------------
// POST /api/import-google-photos
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
    const { albumUrl, eventId } = (await request.json()) as {
        albumUrl?: string
        eventId?: string
    }

    // ── Validation ───────────────────────────────────────────────────────
    if (!albumUrl || !eventId) {
        return Response.json(
            { error: 'albumUrl and eventId are required' },
            { status: 400 },
        )
    }

    if (!isValidAlbumUrl(albumUrl)) {
        return Response.json(
            { error: 'Invalid Google Photos album URL' },
            { status: 400 },
        )
    }

    // Ensure the event exists
    const { data: event } = await supabaseAdmin
        .from('events')
        .select('id')
        .eq('id', eventId)
        .single()

    if (!event) {
        return Response.json({ error: 'Event not found' }, { status: 404 })
    }

    // ── Streaming response ───────────────────────────────────────────────
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            const send = (payload: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(JSON.stringify(payload) + '\n'))
            }

            try {
                // 1. Scrape image URLs from the shared album
                send({ type: 'status', message: 'Extracting images from album…' })

                const images = await GooglePhotosAlbum.fetchImageUrls(albumUrl)

                if (!images || images.length === 0) {
                    send({ type: 'error', message: 'No images found in the album. Make sure the link is a public shared album.' })
                    controller.close()
                    return
                }

                send({ type: 'status', message: `Found ${images.length} images. Starting import…`, total: images.length })

                // Cache the event creator before the loop
                const { data: eventData } = await supabaseAdmin
                    .from('events')
                    .select('created_by')
                    .eq('id', eventId)
                    .single()

                const uploaderId = eventData?.created_by

                let imported = 0
                let failed = 0

                // 2. Process each image sequentially to avoid overwhelming
                for (let i = 0; i < images.length; i++) {
                    const img = images[i]
                    const fullResUrl = `${img.url}=w${img.width}-h${img.height}`

                    try {
                        // Fetch the image bytes
                        const imgResponse = await fetch(fullResUrl)
                        if (!imgResponse.ok) throw new Error(`HTTP ${imgResponse.status}`)

                        const buffer = await imgResponse.arrayBuffer()
                        const fileId = nanoid()
                        const ext = mimeForUrl(img.url) === 'video/mp4' ? 'mp4' : 'jpg'
                        const storagePath = `${eventId}/${fileId}.${ext}`

                        // Upload to Supabase Storage
                        const { error: uploadError } = await supabaseAdmin.storage
                            .from('event-uploads')
                            .upload(storagePath, buffer, {
                                contentType: mimeForUrl(img.url),
                                upsert: false,
                            })

                        if (uploadError) throw uploadError

                        // Build the public URL
                        const { data: urlData } = supabaseAdmin.storage
                            .from('event-uploads')
                            .getPublicUrl(storagePath)

                        await supabaseAdmin.from('uploads').insert({
                            event_id: eventId,
                            uploaded_by: uploaderId,
                            file_type: ext === 'mp4' ? 'video' : 'photo',
                            file_url: urlData.publicUrl,
                            file_size: buffer.byteLength,
                            width: img.width,
                            height: img.height,
                            metadata: {
                                source: 'google-photos-import',
                                original_uid: img.uid,
                                image_update_date: img.imageUpdateDate,
                                album_add_date: img.albumAddDate,
                            },
                        })

                        imported++
                        send({
                            type: 'progress',
                            imported,
                            failed,
                            current: i + 1,
                            total: images.length,
                            fileName: `${fileId}.${ext}`,
                        })
                    } catch (err: unknown) {
                        failed++
                        const message = err instanceof Error ? err.message : 'Unknown error'
                        send({
                            type: 'progress',
                            imported,
                            failed,
                            current: i + 1,
                            total: images.length,
                            error: message,
                        })
                    }
                }

                // 3. Done
                send({ type: 'complete', imported, failed, total: images.length })
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                send({ type: 'error', message })
            } finally {
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
        },
    })
}
