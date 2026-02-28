# Firebase Database Setup Checklist for Aura

## 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/project/aura-1fdd1/firestore)
2. Click "Create Database"
3. Choose **Production mode** (we'll set custom rules next)
4. Select location: `asia-south1` (Mumbai - closest to India)

## 2. Set Up Firestore Security Rules

Navigate to Firestore → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can create/update their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection
    match /events/{eventId} {
      // Anyone can read public events
      allow read: if resource.data.is_public == true;
      // Authenticated users can read any event (for private event access via code)
      allow read: if request.auth != null;
      // Only authenticated users can create events
      allow create: if request.auth != null;
      // Only the creator can update/delete their events
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.created_by;
    }
    
    // Uploads collection
    match /uploads/{uploadId} {
      // Anyone can read uploads for an event
      allow read: if true;
      // Only authenticated users can upload
      allow create: if request.auth != null;
      // Only the uploader can delete
      allow delete: if request.auth != null && 
                      request.auth.uid == resource.data.uploaded_by;
    }
  }
}
```

## 3. Set Up Cloud Storage Rules

Navigate to Storage → Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{eventId}/{filename} {
      // Anyone can read
      allow read: if true;
      // Only authenticated users can upload
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Create Firestore Indexes (Optional - Create as Needed)

Firestore will auto-detect when indexes are needed. When you run queries that need indexes, the Firebase console will show a direct link to create them.

Common indexes you'll likely need:
- Collection: `uploads`
  - Fields: `event_id` (Ascending), `created_at` (Descending)
  
- Collection: `events`
  - Fields: `is_public` (Ascending), `created_at` (Descending)

**These will be auto-suggested when you run the app.**

## 5. Enable Firebase Storage Bucket

1. Go to Storage in Firebase Console
2. Click "Get Started"
3. Choose the same location as Firestore: `asia-south1`

## 6. Enable Authentication Methods

1. Go to Authentication → Sign-in method
2. Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (Add authorized domains: `clawsup.fun` and `localhost`)

## 7. Test Database Connection

Run this command to test:

```bash
cd ~/Desktop/aura
npm run dev
```

Then visit http://localhost:3000 and try:
1. Sign up with email
2. Create an event
3. Check Firebase Console → Firestore to see if data appears

## 🚀 You're Done!

The database structure is auto-created on first write. No SQL migrations needed with Firestore!

## Troubleshooting

**Error: "Missing or insufficient permissions"**
→ Make sure you've published the security rules in Step 2

**Error: "Cloud Storage not enabled"**
→ Complete Step 5

**Error: "Failed to create event"**
→ Check browser console for specific Firebase errors
→ Verify all env vars are set correctly in `.env.local`
