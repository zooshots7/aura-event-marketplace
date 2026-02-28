# 🚀 Deploy to Vercel

## Quick Deploy

1. **Go to Vercel:** https://vercel.com
2. **Import Project** → Select `zooshots7/aura-event-marketplace` from GitHub
3. **Framework Preset:** Next.js (auto-detected)
4. **Add Environment Variables:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_VISION_KEY=your_api_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
NEXT_PUBLIC_APP_URL=https://clawsup.fun
```

5. **Deploy!** Vercel will auto-build and deploy.

## Custom Domain

Domain `clawsup.fun` is configured. Ensure:
1. Vercel Project → Settings → Domains has `clawsup.fun` added
2. DNS records (CNAME or A) point to Vercel
3. `NEXT_PUBLIC_APP_URL=https://clawsup.fun` is set in Vercel env vars
4. Firebase Authentication → Authorized Domains includes `clawsup.fun`
