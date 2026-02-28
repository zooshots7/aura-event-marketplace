import * as admin from 'firebase-admin';

function getApp() {
    if (!admin.apps.length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set');
        }
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    }
    return admin.app();
}

// Lazy getters — only initialize when actually called at runtime, not at build time
const adminDb = new Proxy({} as admin.firestore.Firestore, {
    get(_, prop) {
        return (getApp(), admin.firestore())[prop as keyof admin.firestore.Firestore];
    },
});

const adminAuth = new Proxy({} as admin.auth.Auth, {
    get(_, prop) {
        return (getApp(), admin.auth())[prop as keyof admin.auth.Auth];
    },
});

const adminStorage = new Proxy({} as admin.storage.Storage, {
    get(_, prop) {
        return (getApp(), admin.storage())[prop as keyof admin.storage.Storage];
    },
});

export { adminDb, adminAuth, adminStorage };
