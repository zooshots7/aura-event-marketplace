import Link from 'next/link'
import { Camera, Search, Upload, Zap, TrendingUp, Users, DollarSign, Sparkles, Grid3x3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-blue-900/10" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 sticky top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AURA
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              Start Earning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 relative z-10">
        <section className="container mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center min-h-[85vh]">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-10 shadow-lg shadow-purple-500/5 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">The New Standard for Event Content</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight animate-fade-in-up flex flex-col gap-2">
              <span className="text-white drop-shadow-md">Upload. Discover.</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent pb-3">
                Earn Together.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-100">
              The premium peer-to-peer marketplace for event content.
              <br className="hidden md:block" /> Upload your photos, discover the best shots, and earn a <span className="text-white font-medium">50% revenue share</span>.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-4 mb-14 text-sm font-medium">
              <div className="flex items-center gap-2 px-5 py-3 glass-panel rounded-full hover:border-white/30 transition-colors">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-200">Passive Income</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 glass-panel rounded-full hover:border-white/30 transition-colors">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-200">AI Auto-Tagging</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 glass-panel rounded-full hover:border-white/30 transition-colors">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-gray-200">Thousands of Angles</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/events"
                className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" /> Browse Events
                </span>
              </Link>
              <Link
                href="/create"
                className="px-8 py-4 glass-panel rounded-full text-lg font-bold hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <Upload className="w-5 h-5 text-gray-300" /> Create Event
              </Link>
            </div>
          </div>
        </section>

        {/* P2P Explainer */}
        <section className="relative z-10 container mx-auto px-6 py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                A Complete <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Paradigm Shift</span>.
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Traditional photography is gatekept and scattered. Aura introduces a unified <strong className="text-white font-medium">peer-to-peer ecosystem</strong> valuing every perspective.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-3xl text-center glass-panel-hover group">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-purple-500/50 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <Grid3x3 className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors relative z-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Free Sharing</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Photos dissolve into WhatsApp groups and hard drives. Unsearchable, unorganized, and forgotten.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl text-center glass-panel-hover group opacity-70">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-blue-500/50 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <Camera className="w-10 h-10 text-gray-400 group-hover:text-blue-400 transition-colors relative z-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Pro Photographers</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Cost-prohibitive with a single point of view. You pay exorbitant fees for a curated fraction of the event.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl text-center border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.1)] relative overflow-hidden group hover:border-pink-500/50 transition-all hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-bl-full blur-2xl" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] z-20">
                  THE FUTURE
                </div>
                <div className="w-20 h-20 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-pink-500/30 relative z-10">
                  <Sparkles className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white relative z-10">Aura Marketplace</h3>
                <p className="text-gray-300 text-base leading-relaxed relative z-10">
                  Thousands of lenses. One searchable grid. AI-tagged perfection. You earn for every download.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative z-10 container mx-auto px-6 py-32 bg-white/[0.02]">
          <h2 className="text-5xl font-black text-center mb-20 tracking-tight">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-panel p-10 rounded-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 text-purple-400">
                <span className="text-2xl font-black">1</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Upload & Earn</h3>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Drop your gallery. Our AI automatically tags faces, moments, and quality. Your portfolio is instantly live.
              </p>
              <div className="flex items-center gap-3 text-purple-300 font-semibold bg-purple-500/10 w-fit px-4 py-2 rounded-full border border-purple-500/20">
                <DollarSign className="w-5 h-5 text-purple-400" />
                50% Creator Split
              </div>
            </div>

            <div className="glass-panel p-10 rounded-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 text-blue-400">
                <span className="text-2xl font-black">2</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Discover Magic</h3>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Search the event grid using natural language or face recognition. Instantly find the moments you care about.
              </p>
              <div className="flex items-center gap-3 text-blue-300 font-semibold bg-blue-500/10 w-fit px-4 py-2 rounded-full border border-blue-500/20">
                <Search className="w-5 h-5 text-blue-400" />
                Semantic Search
              </div>
            </div>

            <div className="glass-panel p-10 rounded-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-8 border border-pink-500/20 text-pink-400">
                <span className="text-2xl font-black">3</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Unlock Quality</h3>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Purchase unwatermarked, ultra HD resolution content on demand. Power the economy of shared memories.
              </p>
              <div className="flex items-center gap-3 text-pink-300 font-semibold bg-pink-500/10 w-fit px-4 py-2 rounded-full border border-pink-500/20">
                <Zap className="w-5 h-5 text-pink-400" />
                Instant Download
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 container mx-auto px-6 py-20 pb-32">
          <div className="max-w-6xl mx-auto glass-panel rounded-[3rem] p-16 md:p-20 relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.01]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Built for Creators & Planners</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Scale your event's reach while rewarding the attendees documenting it.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-4 tracking-tighter">
                  50%
                </div>
                <p className="text-xl text-purple-300 font-bold mb-2">Revenue Share</p>
                <p className="text-gray-400 text-sm">Direct to the uploader</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-4 tracking-tighter">
                  ∞
                </div>
                <p className="text-xl text-blue-300 font-bold mb-2">Boundless Angles</p>
                <p className="text-gray-400 text-sm">Crowdsourced coverage</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-4 tracking-tighter">
                  $10+
                </div>
                <p className="text-xl text-pink-300 font-bold mb-2">Micro-transactions</p>
                <p className="text-gray-400 text-sm">Per high-res asset</p>
              </div>
            </div>

            {/* CTA Footer inside stats panel */}
            <div className="mt-20 text-center relative z-10">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full text-xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-1 group"
              >
                Start Earning Fast <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 bg-black/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-500" />
              <div className="text-xl font-bold text-gray-300 tracking-tight">
                AURA
              </div>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
              <Link href="/about" className="hover:text-white transition-colors">Platform</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Creators</Link>
              <Link href="/legal" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-gray-600 text-sm">
              © 2026 Aura Technologies.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
