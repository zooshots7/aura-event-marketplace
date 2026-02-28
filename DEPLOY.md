# 🚀 Deploy to Railway

## Quick Deploy

1. **Go to Railway:** https://railway.app
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select:** `zooshots7/aura-event-marketplace`
4. **Add Environment Variables:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT=your_service_account_json_string
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_VISION_KEY=your_api_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

5. **Deploy!** Railway will auto-detect Next.js and build

## After Deployment

1. Your app is live at `https://clawsup.fun`
2. Add it as `NEXT_PUBLIC_APP_URL` in Railway env vars
3. Update Razorpay webhook URLs to point to Railway
4. Update Supabase site URL & redirect URLs

## Custom Domain

Domain `clawsup.fun` is configured. Ensure:
1. Railway Settings → Domains has `clawsup.fun` added
2. DNS records point to Railway
3. `NEXT_PUBLIC_APP_URL=https://clawsup.fun` is set in Railway env vars
4. Firebase Authentication domains include `https://clawsup.fun`

---

**Pro tip:** Railway offers $5 free credit/month. Should be enough for MVP testing!
