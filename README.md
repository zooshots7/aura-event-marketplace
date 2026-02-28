# AURA - Event Content Marketplace

**Collaborative content sharing for events. Upload, discover, download.**

🌐 **Live at [clawsup.fun](https://clawsup.fun)**

## 🔥 What is Aura?

Aura solves the problem of scattered event content. Instead of everyone hoarding their own photos/videos, attendees upload to a shared event pool. AI auto-tags everything, making it instantly searchable. Creators download what they need, uploaders earn 50% revenue share.

## ✨ Features (MVP)

- ✅ Event pages with unique codes
- ✅ User authentication (Firebase)
- ✅ Upload photos & videos
- ✅ AI auto-tagging (Google Vision API)
- ✅ Search & filter content
- ✅ Watermarked previews
- ✅ Pay-to-download (Razorpay)
- ✅ Revenue sharing with uploaders

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore DB, Cloud Storage)
- **AI:** Google Cloud Vision API
- **Payments:** Razorpay
- **Deployment:** Vercel ([clawsup.fun](https://clawsup.fun))

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd aura
npm install
```

### 2. Set up Firebase
1. Create a new project at [Firebase Console](https://console.firebase.google.com)
2. Follow the [Firebase setup guide](https://firebase.google.com/docs/web/setup) to enable Authentication (Email & Google), Firestore Database, and Cloud Storage.

### 3. Configure Environment Variables

Create `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT=your_service_account_json_string

# Google Cloud Vision
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_VISION_KEY=your_api_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Database Schema

Firestore (NoSQL) collections are auto-created. See `FIRESTORE_SCHEMA.md` for the full structure:

- **users** - User accounts
- **events** - Event pages with unique codes
- **uploads** - Photos/videos with AI tags

## 🎨 Design System

- **Colors:** Purple (#A855F7) + Blue (#3B82F6) gradients
- **Background:** Black (#0A0A0A)
- **Glassmorphism:** Frosted glass effects with blur
- **Animations:** Smooth blob animations on landing

## 💰 Monetization

1. **Pay-per-download:** ₹10-50/photo, ₹100-500/video
2. **Subscriptions:** Creator ($10/mo), Pro ($30/mo)
3. **Event passes:** Organizers buy bulk access
4. **Revenue share:** 50% to uploaders
5. **B2B:** White-label for event companies

## 🚦 Roadmap

**Phase 1 (MVP - Week 1-6):**
- [x] Core platform & auth
- [x] Event creation
- [ ] File upload & AI tagging
- [ ] Search & browse
- [ ] Payment integration
- [ ] User dashboard

**Phase 2 (Scale):**
- [ ] Face recognition (opt-in)
- [ ] Mobile app (React Native)
- [ ] API for event platforms
- [ ] Advanced analytics
- [ ] Social features

**Phase 3 (Pro):**
- [ ] Video editing tools
- [ ] Collaborative albums
- [ ] Real-time uploads during events
- [ ] AI-generated highlights

## 🎯 Go-to-Market

1. **Beta launch:** Target next major India event
2. **Creator outreach:** DM event bloggers/YouTubers
3. **Event partnerships:** Pitch to organizers
4. **Product Hunt:** Launch announcement
5. **Scale:** Paid ads + API integrations

## 📝 Next Steps

1. Finish upload + AI tagging flow
2. Integrate Razorpay payments
3. Build search/filter UI
4. Create user dashboard
5. ✅ Deployed to Vercel at [clawsup.fun](https://clawsup.fun)
6. Onboard beta testers

## 🤝 Contributing

This is a solo project for now. If you're interested in contributing, reach out!

## 📄 License

MIT

---

Built with ✨ in India.
