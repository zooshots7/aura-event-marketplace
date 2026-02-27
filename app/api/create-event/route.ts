import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { name, description, location, startDate, endDate, isPublic } = body

    if (!name) {
        return Response.json({ error: 'Event name is required' }, { status: 400 })
    }

    // Get the authenticated user
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        )
                    } catch {
                        // Server Component - can be safely ignored
                    }
                },
            },
        },
    )

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return Response.json({ error: 'You must be signed in to create an event' }, { status: 401 })
    }

    // Ensure user profile exists
    await supabaseAdmin.from('profiles').upsert(
        {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
            avatar_url: user.user_metadata?.avatar_url || null,
        },
        { onConflict: 'id' },
    )

    const code = nanoid(8)

    const { data, error } = await supabaseAdmin
        .from('events')
        .insert({
            code,
            name,
            description: description || null,
            location: location || null,
            start_date: startDate || null,
            end_date: endDate || null,
            is_public: isPublic ?? true,
            created_by: user.id,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating event:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ event: data })
}
