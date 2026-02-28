'use client'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { Event } from '../events/page'
import Link from 'next/link'
import {
    Sparkles,
    ImagePlus,
    Loader2,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Link2,
    ChevronDown,
} from 'lucide-react'

type ImportState = 'idle' | 'loading' | 'importing' | 'done' | 'error'

type ProgressLine = {
    type: 'status' | 'progress' | 'complete' | 'error'
    message?: string
    imported?: number
    failed?: number
    current?: number
    total?: number
    fileName?: string
    error?: string
}

function ImportPageInner() {
    const searchParams = useSearchParams()
    const [albumUrl, setAlbumUrl] = useState('')
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEventId, setSelectedEventId] = useState('')
    const [state, setState] = useState<ImportState>('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [progress, setProgress] = useState({ imported: 0, failed: 0, current: 0, total: 0 })
    const [errorMessage, setErrorMessage] = useState('')
    const abortRef = useRef<AbortController | null>(null)

    // Fetch events on mount & auto-select from URL param
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, 'events'), where('is_public', '==', true), orderBy('created_at', 'desc'));
                const snap = await getDocs(q);
                const data: Event[] = [];
                snap.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Event));

                setEvents(data)
                const preselect = searchParams.get('eventId')
                if (preselect && data.some(e => e.id === preselect)) {
                    setSelectedEventId(preselect)
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        }
        fetchEvents()
    }, [searchParams])

    const handleImport = useCallback(async () => {
        if (!albumUrl || !selectedEventId) return

        setState('loading')
        setStatusMessage('Connecting to Google Photos…')
        setProgress({ imported: 0, failed: 0, current: 0, total: 0 })
        setErrorMessage('')

        const controller = new AbortController()
        abortRef.current = controller

        try {
            const response = await fetch('/api/import-google-photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ albumUrl, eventId: selectedEventId }),
                signal: controller.signal,
            })

            if (!response.ok || !response.body) {
                const err = await response.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(err.error || `HTTP ${response.status}`)
            }

            setState('importing')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })

                // Process each newline-delimited JSON chunk
                const lines = buffer.split('\n')
                buffer = lines.pop() || '' // keep partial line in buffer

                for (const line of lines) {
                    if (!line.trim()) continue
                    try {
                        const data: ProgressLine = JSON.parse(line)

                        if (data.type === 'status') {
                            setStatusMessage(data.message || '')
                            if (data.total) {
                                setProgress(prev => ({ ...prev, total: data.total! }))
                            }
                        } else if (data.type === 'progress') {
                            setProgress({
                                imported: data.imported ?? 0,
                                failed: data.failed ?? 0,
                                current: data.current ?? 0,
                                total: data.total ?? 0,
                            })
                        } else if (data.type === 'complete') {
                            setProgress({
                                imported: data.imported ?? 0,
                                failed: data.failed ?? 0,
                                current: data.total ?? 0,
                                total: data.total ?? 0,
                            })
                            setState('done')
                        } else if (data.type === 'error') {
                            setErrorMessage(data.message || 'Something went wrong')
                            setState('error')
                        }
                    } catch {
                        // skip invalid JSON chunks
                    }
                }
            }

            // If we finished reading and haven't set done/error yet
            if (state !== 'done' && state !== 'error') {
                setState('done')
            }
        } catch (err: unknown) {
            if ((err as Error).name === 'AbortError') {
                setStatusMessage('Import cancelled.')
                setState('idle')
            } else {
                setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
                setState('error')
            }
        }
    }, [albumUrl, selectedEventId, state])

    const progressPercent =
        progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

    const selectedEvent = events.find(e => e.id === selectedEventId)

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-blue-900/10" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
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
                    <Link
                        href="/events"
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Browse Events
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 relative z-10 flex items-center justify-center px-6 py-20">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-6 shadow-lg shadow-purple-500/5">
                            <ImagePlus className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">
                                Google Photos Import
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Import from{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                                Google Photos
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">
                            Paste a shared album link and we&apos;ll import every photo at full resolution into your event.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-bl-full blur-2xl pointer-events-none" />

                        {/* ── IDLE / LOADING FORM ─────────────────────────────── */}
                        {(state === 'idle' || state === 'loading') && (
                            <div className="space-y-6 relative z-10">
                                {/* Album URL */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <Link2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                                        Shareable Album Link
                                    </label>
                                    <input
                                        type="url"
                                        value={albumUrl}
                                        onChange={e => setAlbumUrl(e.target.value)}
                                        placeholder="https://photos.app.goo.gl/..."
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition text-white placeholder:text-gray-600 text-base"
                                        disabled={state === 'loading'}
                                    />
                                </div>

                                {/* Event Selector */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Select Event
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedEventId}
                                            onChange={e => setSelectedEventId(e.target.value)}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition text-white appearance-none cursor-pointer text-base"
                                            disabled={state === 'loading'}
                                        >
                                            <option value="" className="bg-gray-900">
                                                Choose an event…
                                            </option>
                                            {events.map(event => (
                                                <option key={event.id} value={event.id} className="bg-gray-900">
                                                    {event.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                    </div>
                                    {events.length === 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            No events found.{' '}
                                            <Link href="/create" className="text-purple-400 hover:text-purple-300">
                                                Create one first
                                            </Link>
                                            .
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleImport}
                                    disabled={!albumUrl || !selectedEventId || state === 'loading'}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-3"
                                >
                                    {state === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Connecting…
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus className="w-5 h-5" />
                                            Start Import
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* ── IMPORTING PROGRESS ──────────────────────────────── */}
                        {state === 'importing' && (
                            <div className="space-y-8 relative z-10">
                                <div className="text-center">
                                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                                    <p className="text-lg font-semibold text-white">Importing Photos…</p>
                                    <p className="text-sm text-gray-400 mt-1">{statusMessage}</p>
                                </div>

                                {/* Progress bar */}
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>
                                            {progress.current} / {progress.total} processed
                                        </span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 justify-center">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-300 font-medium">{progress.imported} imported</span>
                                    </div>
                                    {progress.failed > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <XCircle className="w-4 h-4 text-red-400" />
                                            <span className="text-red-300 font-medium">{progress.failed} failed</span>
                                        </div>
                                    )}
                                </div>

                                {/* Cancel */}
                                <button
                                    onClick={() => abortRef.current?.abort()}
                                    className="w-full py-3 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/30 transition"
                                >
                                    Cancel Import
                                </button>
                            </div>
                        )}

                        {/* ── DONE ────────────────────────────────────────────── */}
                        {state === 'done' && (
                            <div className="space-y-8 relative z-10 text-center">
                                <div>
                                    <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Import Complete!</h2>
                                    <p className="text-gray-400">
                                        Successfully imported <span className="text-white font-semibold">{progress.imported}</span> photo{progress.imported !== 1 ? 's' : ''}
                                        {progress.failed > 0 && (
                                            <span className="text-red-400"> ({progress.failed} failed)</span>
                                        )}
                                        {selectedEvent && (
                                            <span>
                                                {' '}into <span className="text-purple-300 font-semibold">{selectedEvent.name}</span>
                                            </span>
                                        )}
                                        .
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {selectedEvent && (
                                        <Link
                                            href={`/events/${selectedEvent.code}`}
                                            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
                                        >
                                            View Event <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            setState('idle')
                                            setAlbumUrl('')
                                            setProgress({ imported: 0, failed: 0, current: 0, total: 0 })
                                        }}
                                        className="flex-1 py-3 border border-white/10 rounded-xl font-semibold text-gray-300 hover:text-white hover:border-white/30 transition"
                                    >
                                        Import Another Album
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── ERROR ───────────────────────────────────────────── */}
                        {state === 'error' && (
                            <div className="space-y-8 relative z-10 text-center">
                                <div>
                                    <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                                        <XCircle className="w-10 h-10 text-red-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Import Failed</h2>
                                    <p className="text-gray-400">{errorMessage}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setState('idle')
                                        setErrorMessage('')
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function ImportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" />
            </div>
        }>
            <ImportPageInner />
        </Suspense>
    )
}
