import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { nanoid } from 'nanoid'

const GUEST_ID = '00000000-0000-0000-0000-000000000000'
const GUEST_EMAIL = 'guest@clawsup.fun'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { name, description, location, startDate, endDate, isPublic } = body

    if (!name) {
        return Response.json({ error: 'Event name is required' }, { status: 400 })
    }

    // Ensure a guest profile exists for anonymous event creation
    await supabaseAdmin.from('profiles').upsert(
        {
            id: GUEST_ID,
            email: GUEST_EMAIL,
            full_name: 'Guest User',
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
            created_by: GUEST_ID,
        })
        .select()
        .single()

    if (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ event: data })
}
