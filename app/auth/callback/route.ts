import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/events'

    if (code) {
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
                            // The `setAll` method is called from within a Server Component
                            // where cookies cannot be set. This can be safely ignored if
                            // we have middleware refreshing user sessions.
                        }
                    },
                },
            },
        )

        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && session?.user) {
            // Upsert profile for OAuth users
            const user = session.user
            await supabase.from('profiles').upsert(
                {
                    id: user.id,
                    email: user.email!,
                    full_name:
                        user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split('@')[0] ||
                        null,
                    avatar_url: user.user_metadata?.avatar_url || null,
                },
                { onConflict: 'id' },
            )
        }

        if (error) {
            console.error('Auth callback error:', error.message)
            return NextResponse.redirect(
                new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
            )
        }
    }

    // Redirect to the requested page or events
    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
