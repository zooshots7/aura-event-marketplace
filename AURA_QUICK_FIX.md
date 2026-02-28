# 🚨 Quick Fix for Aura Event Creation

## Problem
- Events not being created
- Events list showing empty even after "creating" events
- Silent failures in Firebase

## Root Causes
1. **Firestore Security Rules** blocking writes (test mode expired or not set)
2. **Composite Index** missing for events query

---

## Fix 1: Enable Test Mode Rules (Temporary - 30 Days)

**Go to:** https://console.firebase.google.com/project/aura-88cf1/firestore/rules

**Replace with:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 4, 1);
    }
  }
}
```

**Click:** Publish

⚠️ **Note:** This allows ALL reads/writes until April 1, 2026. Good for testing. Switch to proper rules later.

---

## Fix 2: Create Composite Index

**Option A: Click the Auto-Generated Link**

When you try to create an event, browser console will show:
```
The query requires an index. You can create it here: https://console.firebase...
```
Just click that link → Create Index → Wait 2 minutes

**Option B: Manual**

1. Go to: https://console.firebase.google.com/project/aura-88cf1/firestore/indexes
2. Click "Create Index"
3. Settings:
   - Collection: `events`
   - Fields:
     - `is_public` → Ascending
     - `created_at` → Descending
4. Click "Create"
5. Wait 1-2 minutes for index to build

---

## Fix 3: Temporary Code Fix (While Index Builds)

Edit `app/events/page.tsx`:

**Find this (line ~33):**
```javascript
const q = query(
  collection(db, 'events'),
  where('is_public', '==', true),
  orderBy('created_at', 'desc')
)
```

**Replace with:**
```javascript
// Temporary: Remove orderBy until index is ready
const q = query(
  collection(db, 'events'),
  where('is_public', '==', true)
)
```

**Then manually sort:**
```javascript
const fetchedEvents: Event[] = []
querySnapshot.forEach((doc) => {
  fetchedEvents.push({ id: doc.id, ...doc.data() } as Event)
})

// Sort manually by created_at
fetchedEvents.sort((a, b) => {
  const dateA = new Date(a.created_at || 0).getTime()
  const dateB = new Date(b.created_at || 0).getTime()
  return dateB - dateA // Descending
})

setEvents(fetchedEvents)
```

Once index is ready (2-3 min), revert this change.

---

## Verify Fix

After Fix 1 & 2:

1. Refresh http://localhost:3000
2. Sign in
3. Create a test event
4. Go to /events
5. Event should appear!

---

## Check Database

Run this to verify events are being saved:
```bash
cd ~/Desktop/aura
node debug-events.js
```

Should show:
```
Found: X events
```

---

## Long-Term: Proper Security Rules

After testing, replace test mode rules with proper ones from `SETUP_CHECKLIST.md`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read: if resource.data.is_public == true || request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.created_by;
    }
    match /uploads/{uploadId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                      request.auth.uid == resource.data.uploaded_by;
    }
  }
}
```

---

## Priority Order

1. ⚡ **Fix 1 first** (security rules) - Events will start saving
2. ⚡ **Fix 2** (index) - Events list will load
3. ✅ Test event creation
4. 🔒 Set proper rules (later)
