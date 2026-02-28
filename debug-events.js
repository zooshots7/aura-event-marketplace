// Debug script to check events in Firestore
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

async function debugEvents() {
    console.log('🔍 Debugging Events Collection\n');
    
    try {
        // 1. Check total events (no filters)
        console.log('1️⃣ Checking ALL events (no filters)...');
        const allEvents = await db.collection('events').get();
        console.log(`   Found: ${allEvents.size} events\n`);
        
        if (allEvents.size > 0) {
            allEvents.forEach(doc => {
                const data = doc.data();
                console.log(`   📋 Event ID: ${doc.id}`);
                console.log(`      Name: ${data.name}`);
                console.log(`      Code: ${data.code}`);
                console.log(`      Public: ${data.is_public}`);
                console.log(`      Created: ${data.created_at}`);
                console.log(`      Created By: ${data.created_by}\n`);
            });
        }
        
        // 2. Check public events only
        console.log('2️⃣ Checking PUBLIC events only...');
        const publicEvents = await db.collection('events')
            .where('is_public', '==', true)
            .get();
        console.log(`   Found: ${publicEvents.size} public events\n`);
        
        // 3. Check users collection
        console.log('3️⃣ Checking users collection...');
        const users = await db.collection('users').get();
        console.log(`   Found: ${users.size} users\n`);
        
        if (users.size > 0) {
            users.forEach(doc => {
                const data = doc.data();
                console.log(`   👤 User ID: ${doc.id}`);
                console.log(`      Email: ${data.email}`);
                console.log(`      Name: ${data.full_name}\n`);
            });
        }
        
        // 4. Check for composite index issue
        console.log('4️⃣ Testing composite query (is_public + orderBy created_at)...');
        try {
            const indexedQuery = await db.collection('events')
                .where('is_public', '==', true)
                .orderBy('created_at', 'desc')
                .get();
            console.log(`   ✅ Composite query works! Found: ${indexedQuery.size} events\n`);
        } catch (error) {
            console.log(`   ❌ Composite query FAILED!`);
            console.log(`   Error: ${error.message}`);
            if (error.message.includes('index')) {
                console.log(`   \n   🔧 FIX: You need to create a composite index!`);
                console.log(`   Firebase will show a link in the error or browser console.`);
                console.log(`   OR go to: https://console.firebase.google.com/project/aura-88cf1/firestore/indexes\n`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

debugEvents().then(() => process.exit(0));
