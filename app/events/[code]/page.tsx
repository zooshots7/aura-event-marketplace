'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import {
    Sparkles,
    MapPin,
    CalendarDays,
    ImagePlus,
    Zap,
    Loader2,
    Image as ImageIcon,
    X,
    CheckCircle2,
    ArrowLeft,
} from 'lucide-react'

export interface Event {
    id: string;
    code: string;
    name: string;
    description?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    is_public: boolean;
    created_at?: string;
    created_by?: string;
}

export interface Upload {
    id: string;
    event_id: string;
    file_url: string;
    thumbnail_url?: string;
    blur_hash?: string;
    ai_tags?: string[];
    width?: number;
    height?: number;
    created_at?: string;
}

export default function EventDetail({
    params,
}: {
    params: Promise<{ code: string }>
}) {
    const { code } = use(params)
    const [event, setEvent] = useState<Event | null>(null)
    const [uploads, setUploads] = useState<Upload[]>([])
    const [loading, setLoading] = useState(true)
    const [analyzing, setAnalyzing] = useState(false)
    const [analyzeResult, setAnalyzeResult] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

    const fetchEvent = useCallback(async () => {
        try {
            // Fetch Event
            const eventQuery = query(collection(db, 'events'), where('code', '==', code));
            const eventSnap = await getDocs(eventQuery);
            if (!eventSnap.empty) {
                const evData = { id: eventSnap.docs[0].id, ...eventSnap.docs[0].data() } as Event;
                setEvent(evData);

                // Fetch Uploads (no composite index needed - sort client-side)
                const uploadsQuery = query(
                    collection(db, 'uploads'),
                    where('event_id', '==', evData.id)
                );
                const uploadsSnap = await getDocs(uploadsQuery);
                const upsData: Upload[] = [];
                uploadsSnap.forEach(d => upsData.push({ id: d.id, ...d.data() } as Upload));
                // Sort by created_at descending client-side
                upsData.sort((a, b) => {
                    const dateA = new Date(a.created_at || 0).getTime()
                    const dateB = new Date(b.created_at || 0).getTime()
                    return dateB - dateA
                });
                setUploads(upsData);
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
        } finally {
            setLoading(false);
        }
    }, [code])

    useEffect(() => {
        fetchEvent()
    }, [fetchEvent])

    // Collect all unique tags from uploads
    const allTags = Array.from(
        new Set(
            uploads.flatMap(u => {
                if (!u.ai_tags) return []
                if (Array.isArray(u.ai_tags)) return u.ai_tags as string[]
                return []
            }),
        ),
    ).sort()

    // Filter uploads by selected tags
    const filteredUploads =
        selectedTags.length === 0
            ? uploads
            : uploads.filter(u => {
                if (!u.ai_tags || !Array.isArray(u.ai_tags)) return false
                return selectedTags.some(tag => (u.ai_tags as string[]).includes(tag))
            })

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
        )
    }

    const handleAnalyze = async () => {
        if (!event) return
        setAnalyzing(true)
        setAnalyzeResult('')

        try {
            const res = await fetch('/api/analyze-uploads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: event.id }),
            })

            const data = await res.json()
            if (data.error) {
                setAnalyzeResult(`Error: ${data.error}`)
            } else {
                setAnalyzeResult(data.message || `Analyzed ${data.analyzed} photos`)
                // Refresh uploads to get new tags
                await fetchEvent()
            }
        } catch {
            setAnalyzeResult('Failed to analyze uploads')
        } finally {
            setAnalyzing(false)
        }
    }

    const unanalyzedCount = uploads.filter(u => !u.ai_tags).length

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <p className="text-gray-400 text-lg">Event not found</p>
                <Link
                    href="/events"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-blue-900/10" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 sticky top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-5 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2"
                    >
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        AURA
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/events"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Browse Events
                        </Link>
                        <Link
                            href="/create"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Create Event
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 relative z-10">
                {/* Event Header */}
                <div className="border-b border-white/5">
                    <div className="container mx-auto px-6 py-12 md:py-16">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" /> All Events
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            {event.name}
                        </h1>

                        {event.description && (
                            <p className="text-lg text-gray-400 max-w-3xl mb-6">{event.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            {event.location && (
                                <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    {event.location}
                                </div>
                            )}
                            {event.start_date && (
                                <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                                    <CalendarDays className="w-4 h-4 text-blue-400" />
                                    {new Date(event.start_date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                                <ImageIcon className="w-4 h-4 text-pink-400" />
                                {uploads.length} photo{uploads.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="border-b border-white/5">
                    <div className="container mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
                        <Link
                            href={`/import?eventId=${event.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                        >
                            <ImagePlus className="w-4 h-4" /> Import Photos
                        </Link>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing || uploads.length === 0}
                            className="inline-flex items-center gap-2 px-5 py-2.5 glass-panel rounded-full text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {analyzing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4 text-yellow-400" />
                            )}
                            {analyzing
                                ? 'Analyzing…'
                                : unanalyzedCount > 0
                                    ? `Analyze ${unanalyzedCount} Photo${unanalyzedCount !== 1 ? 's' : ''}`
                                    : 'All Analyzed ✓'}
                        </button>

                        {analyzeResult && (
                            <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                {analyzeResult}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tag Filter Bar */}
                {allTags.length > 0 && (
                    <div className="border-b border-white/5">
                        <div className="container mx-auto px-6 py-3">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider shrink-0">
                                    Filter:
                                </span>
                                {selectedTags.length > 0 && (
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-400 hover:bg-red-500/20 transition"
                                    >
                                        <X className="w-3 h-3" /> Clear
                                    </button>
                                )}
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition border ${selectedTags.includes(tag)
                                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Gallery */}
                <div className="container mx-auto px-6 py-8">
                    {uploads.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                <ImageIcon className="w-12 h-12 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-300">No photos yet</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Import photos from Google Photos or upload them directly to get started.
                            </p>
                            <Link
                                href={`/import?eventId=${event.id}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition"
                            >
                                <ImagePlus className="w-5 h-5" /> Import from Google Photos
                            </Link>
                        </div>
                    ) : (
                        <>
                            {selectedTags.length > 0 && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Showing {filteredUploads.length} of {uploads.length} photos
                                </p>
                            )}

                            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                                {filteredUploads.map(upload => (
                                    <div
                                        key={upload.id}
                                        className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer bg-white/[0.02]"
                                        onClick={() => setLightboxUrl(upload.file_url)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={upload.file_url}
                                            alt=""
                                            className="w-full block"
                                            loading="lazy"
                                            style={{
                                                aspectRatio:
                                                    upload.width && upload.height
                                                        ? `${upload.width} / ${upload.height}`
                                                        : undefined,
                                            }}
                                        />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                {upload.ai_tags && Array.isArray(upload.ai_tags) && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {(upload.ai_tags as string[]).slice(0, 3).map((tag: string) => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-[10px] text-gray-200 border border-white/10"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredUploads.length === 0 && selectedTags.length > 0 && (
                                <div className="text-center py-16">
                                    <p className="text-gray-500">No photos match the selected tags.</p>
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="mt-3 text-purple-400 hover:text-purple-300 text-sm"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Lightbox */}
            {lightboxUrl && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setLightboxUrl(null)}
                >
                    <button
                        className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        onClick={() => setLightboxUrl(null)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightboxUrl}
                        alt=""
                        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
