import { NextRequest } from 'next/server'
import { adminDb, adminStorage } from '@/lib/firebase-admin'
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

/**
 * Resolve a Google Photos URL to its full form.
 * Short links (photos.app.goo.gl) redirect to the full photos.google.com URL.
 * For photos.google.com URLs, ensure the link has the key query param.
 */
async function resolveAlbumUrl(url: string): Promise<string> {
    // If it's a short link, follow redirects to get the full URL
    if (url.includes('photos.app.goo.gl')) {
        const res = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            },
        })
        return res.url
    }
    return url
}

function mimeForUrl(url: string): string {
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
            { error: 'Invalid Google Photos album URL. Please use a photos.app.goo.gl or photos.google.com share link.' },
            { status: 400 },
        )
    }

    // Ensure the event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();

    if (!eventDoc.exists) {
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
                // 1. Resolve short URLs and scrape image URLs
                send({ type: 'status', message: 'Resolving album link…' })

                let resolvedUrl: string
                try {
                    resolvedUrl = await resolveAlbumUrl(albumUrl)
                } catch {
                    send({
                        type: 'error',
                        message: 'Failed to resolve the album URL. Please make sure you copied the complete share link including the ?key= parameter.',
                    })
                    controller.close()
                    return
                }

                send({ type: 'status', message: 'Extracting images from album…' })

                let images: Awaited<ReturnType<typeof GooglePhotosAlbum.fetchImageUrls>>
                try {
                    images = await GooglePhotosAlbum.fetchImageUrls(resolvedUrl)
                } catch (scrapeErr: unknown) {
                    const msg = scrapeErr instanceof Error ? scrapeErr.message : 'Unknown'
                    if (msg.includes('404')) {
                        send({
                            type: 'error',
                            message: 'Could not access the album (404). Please make sure you copied the COMPLETE share link from Google Photos, including the ?key= parameter at the end. The URL should look like: photos.google.com/share/...?key=...',
                        })
                    } else {
                        send({
                            type: 'error',
                            message: `Failed to extract images: ${msg}`,
                        })
                    }
                    controller.close()
                    return
                }

                if (!images || images.length === 0) {
                    send({
                        type: 'error',
                        message: 'No images found in the album. Make sure the link is a public shared album with the complete URL including the ?key= parameter.',
                    })
                    controller.close()
                    return
                }

                send({
                    type: 'status',
                    message: `Found ${images.length} images. Starting import…`,
                    total: images.length,
                })

                const uploaderId = eventDoc.data()?.created_by || null

                let imported = 0
                let failed = 0

                // 2. Process each image sequentially
                for (let i = 0; i < images.length; i++) {
                    const img = images[i]
                    const fullResUrl = `${img.url}=w${img.width}-h${img.height}`

                    try {
                        const imgResponse = await fetch(fullResUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                            },
                        })
                        if (!imgResponse.ok) throw new Error(`HTTP ${imgResponse.status}`)

                        const buffer = await imgResponse.arrayBuffer()
                        const fileId = nanoid()
                        const ext = mimeForUrl(img.url) === 'video/mp4' ? 'mp4' : 'jpg'
                        const storagePath = `events/${eventId}/${fileId}.${ext}`

                        // Upload to Firebase Storage
                        const bucket = adminStorage.bucket();
                        const file = bucket.file(storagePath);

                        await file.save(Buffer.from(buffer), {
                            metadata: {
                                contentType: mimeForUrl(img.url),
                            },
                        });

                        // Make the file public
                        await file.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

                        // Insert to Firestore
                        await adminDb.collection('uploads').add({
                            event_id: eventId,
                            uploaded_by: uploaderId,
                            file_type: ext === 'mp4' ? 'video' : 'photo',
                            file_url: publicUrl,
                            file_size: buffer.byteLength,
                            width: img.width,
                            height: img.height,
                            created_at: new Date().toISOString(),
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
