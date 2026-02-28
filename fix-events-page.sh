#!/bin/bash
# Quick fix for events page - removes orderBy to avoid index requirement

cd ~/Desktop/aura

echo "📝 Backing up original file..."
cp app/events/page.tsx app/events/page.tsx.backup

echo "🔧 Applying fix..."

# Create the fixed version
cat > app/events/page.tsx.tmp << 'ENDFILE'
'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { Calendar, MapPin, Users, Plus } from 'lucide-react'

// Define Event inline locally as it used to come from lib/supabase
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
  cover_image?: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // Temporary: Remove orderBy to avoid composite index requirement
      // Once index is created in Firebase Console, you can add back: orderBy('created_at', 'desc')
      const q = query(
        collection(db, 'events'),
        where('is_public', '==', true)
      )

      const querySnapshot = await getDocs(q)
      const fetchedEvents: Event[] = []
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event)
      })

      // Sort manually by created_at (newest first)
      fetchedEvents.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })

      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AURA
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Discover Events</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">No events yet. Be the first to create one!</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.code}`}
                className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition"
              >
                {event.cover_image ? (
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/20" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}
                  {event.start_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
ENDFILE

mv app/events/page.tsx.tmp app/events/page.tsx

echo "✅ Fix applied!"
echo ""
echo "Backup saved to: app/events/page.tsx.backup"
echo ""
echo "Now:"
echo "1. Go to Firebase Console and set security rules (see AURA_QUICK_FIX.md)"
echo "2. Refresh your browser"
echo "3. Create an event"
echo "4. Events should appear!"
