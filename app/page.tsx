import Link from 'next/link'
import { Camera, Search, Upload, Zap, TrendingUp, Users, DollarSign, Sparkles, Grid3x3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Nav */}
        <nav className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AURA
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition"
              >
                Start Earning
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">The Uber for Event Content</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Upload. Discover.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Earn Together.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The first peer-to-peer marketplace for event content. 
              Upload your photos, download others', earn 50% revenue share.
            </p>
            
            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span>Earn from uploads</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>AI-powered search</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <Users className="w-4 h-4 text-blue-400" />
                <span>No photographer needed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-105"
              >
                Browse Events
              </Link>
              <Link
                href="/create"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* P2P Explainer */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
              <span className="text-purple-300 font-semibold">Creator Economy for Events</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Everyone's a Supplier.
              <br />
              Everyone's a Customer.
            </h2>
            <p className="text-xl text-gray-400">
              Unlike traditional photo sharing (free but scattered) or pro photographers (expensive but limited), 
              Aura creates a <strong className="text-white">peer-to-peer marketplace</strong> where attendees upload, 
              discover, and monetize their content together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Old Way: Free Sharing</h3>
              <p className="text-gray-400 text-sm">
                Content scattered across Google Photos, WhatsApp groups. Hard to find, no incentive to upload.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Old Way: Pro Photographers</h3>
              <p className="text-gray-400 text-sm">
                Expensive. Limited angles. Only one perspective. You pay hundreds for a few shots.
              </p>
            </div>

            <div className="text-center relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                NEW
              </div>
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Aura: P2P Marketplace</h3>
              <p className="text-gray-400 text-sm">
                Everyone uploads. AI tags everything. Pay only for what you need. Uploaders earn 50%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">1. Upload & Earn</h3>
            <p className="text-gray-400 mb-4">
              Attended an event? Upload your best shots. AI auto-tags faces, moments, locations.
            </p>
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <DollarSign className="w-5 h-5" />
              Earn 50% per download
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">2. Discover Instantly</h3>
            <p className="text-gray-400 mb-4">
              Search by person, moment, or vibe. Find yourself in hundreds of uploads. Preview free.
            </p>
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Zap className="w-5 h-5" />
              AI-powered search
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/40 transition">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">3. Pay & Download</h3>
            <p className="text-gray-400 mb-4">
              Found the perfect shot? Pay ₹10-50 for photos, ₹100-500 for videos. Support fellow creators.
            </p>
            <div className="flex items-center gap-2 text-pink-400 font-semibold">
              <TrendingUp className="w-5 h-5" />
              Support creators
            </div>
          </div>
        </div>
      </div>

      {/* Why Different */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Aura is Different</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Earn from Your Uploads</h3>
              <p className="text-gray-400">
                50% revenue share. Turn event photos into passive income. The more you upload, the more you earn.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Discovery</h3>
              <p className="text-gray-400">
                Find anyone, anything, any moment instantly. No manual tagging. No endless scrolling.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">No Photographer Needed</h3>
              <p className="text-gray-400">
                Democratized content. Everyone contributes. Get 100x more angles than a single photographer.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Pay Only for What You Need</h3>
              <p className="text-gray-400">
                Not bundled packages. Download 1 photo or 100. Watermarked previews. Full-res downloads.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                50%
              </div>
              <p className="text-gray-300">Revenue Share</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                ₹10-500
              </div>
              <p className="text-gray-300">Per Download</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                100x
              </div>
              <p className="text-gray-300">More Perspectives</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Creator Economy</h2>
          <p className="text-xl text-gray-300 mb-8">
            Upload your next event. Earn from your content. Support fellow creators.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-105"
          >
            Start Earning Free
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required. Upload unlimited. Earn 50% on every download.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AURA
            </div>
            <div className="flex gap-6 text-gray-400">
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
              <Link href="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 Aura. The Uber for Event Content.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
