// Firebase Connection Test Script
// Run from: ~/Desktop/aura

const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

console.log('🔥 Testing Firebase Connection...\n');
console.log('Project ID:', projectId);
console.log('Client Email:', clientEmail);
console.log('Private Key:', privateKey ? '✅ Loaded' : '❌ Missing');
console.log('');

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log('✅ Firebase Admin initialized\n');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        process.exit(1);
    }
}

const db = admin.firestore();

async function testConnection() {
    try {
        console.log('📝 Testing Firestore write...');
        
        // Create a test document
        const testRef = db.collection('_test').doc('connection-test');
        await testRef.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            message: 'Connection test successful',
            status: 'ok'
        });
        
        console.log('✅ Write successful\n');
        
        console.log('📖 Testing Firestore read...');
        const doc = await testRef.get();
        
        if (doc.exists) {
            console.log('✅ Read successful');
            console.log('Data:', doc.data());
        } else {
            console.log('❌ Document not found');
        }
        
        console.log('\n🗑️  Cleaning up test document...');
        await testRef.delete();
        console.log('✅ Cleanup successful\n');
        
        // Check for existing collections
        console.log('📊 Checking existing collections...');
        const collections = await db.listCollections();
        console.log('Collections found:', collections.map(c => c.id).join(', ') || 'None');
        
        // Check events collection
        console.log('\n📅 Checking events collection...');
        const eventsSnapshot = await db.collection('events').limit(5).get();
        console.log(`Found ${eventsSnapshot.size} events`);
        
        if (eventsSnapshot.size > 0) {
            eventsSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`  - ${data.name} (code: ${data.code})`);
            });
        } else {
            console.log('  No events yet - database is ready for first event creation');
        }
        
        // Check uploads collection
        console.log('\n📸 Checking uploads collection...');
        const uploadsSnapshot = await db.collection('uploads').limit(5).get();
        console.log(`Found ${uploadsSnapshot.size} uploads`);
        
        console.log('\n✅ All Firebase tests passed! Database is ready.\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection().then(() => process.exit(0));
