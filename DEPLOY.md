# 🚀 Deploy to Railway

## Quick Deploy

1. **Go to Railway:** https://railway.app
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select:** `zooshots7/aura-event-marketplace`
4. **Add Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_VISION_KEY=your_api_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

5. **Deploy!** Railway will auto-detect Next.js and build

## After Deployment

1. Copy your Railway URL (e.g., `https://aura.railway.app`)
2. Add it as `NEXT_PUBLIC_APP_URL` in Railway env vars
3. Update Razorpay webhook URLs to point to Railway
4. Update Supabase site URL & redirect URLs

## Custom Domain (Optional)

1. Go to Railway Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Update `NEXT_PUBLIC_APP_URL` to your domain

---

**Pro tip:** Railway offers $5 free credit/month. Should be enough for MVP testing!
