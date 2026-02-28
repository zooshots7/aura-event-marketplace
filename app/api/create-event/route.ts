import { NextRequest } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

// Utility function to generate a random 8-character string for event code
const nanoid = (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { name, description, location, startDate, endDate, isPublic } = body

    if (!name) {
        return Response.json({ error: 'Event name is required' }, { status: 400 })
    }

    try {
        // Authenticate the user checking the Authorization header bearer token
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 })
        }

        const idToken = authHeader.split('Bearer ')[1]
        const decodedToken = await adminAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        // Ensure user profile exists
        const userRef = adminDb.collection('users').doc(uid)
        const userDoc = await userRef.get()
        if (!userDoc.exists) {
            await userRef.set({
                email: decodedToken.email || '',
                full_name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
            }, { merge: true })
        }

        const code = nanoid(8)

        const newEvent = {
            id: adminDb.collection('events').doc().id,
            code,
            name,
            description: description || null,
            location: location || null,
            start_date: startDate || null,
            end_date: endDate || null,
            is_public: isPublic ?? true,
            created_by: uid,
            created_at: new Date().toISOString()
        }

        await adminDb.collection('events').doc(newEvent.id).set(newEvent)

        return Response.json({ event: newEvent })
    } catch (error: any) {
        console.error('Error creating event:', error)
        return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
