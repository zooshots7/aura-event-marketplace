import Link from 'next/link'
import { Camera, Search, Upload, Zap, TrendingUp, Users } from 'lucide-react'

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
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Event,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Everyone's Content
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Upload. Discover. Download. The collaborative content marketplace for events.
              AI-powered tagging makes finding the perfect shot instant.
            </p>
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

      {/* How It Works */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Upload</h3>
            <p className="text-gray-400">
              Join an event and upload your photos & videos. AI automatically tags everything.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Discover</h3>
            <p className="text-gray-400">
              Search by person, moment, or vibe. Find the perfect shot from hundreds of uploads.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/40 transition">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Download</h3>
            <p className="text-gray-400">
              Preview free. Pay to download high-res. Uploaders earn 50% revenue share.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Creators Love Aura</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Search</h3>
              <p className="text-gray-400">
                Find anyone, anything, any moment instantly with smart tagging.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Earn from Uploads</h3>
              <p className="text-gray-400">
                50% revenue share. Turn your event content into passive income.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Collaborative Pool</h3>
              <p className="text-gray-400">
                Everyone uploads, everyone benefits. No more scattered content.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                Watermarked previews. Full-res downloads. Professional-grade assets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to amplify your event content?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators sharing and discovering event moments.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-105"
          >
            Get Started Free
          </Link>
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
              © 2026 Aura. Built for creators.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
