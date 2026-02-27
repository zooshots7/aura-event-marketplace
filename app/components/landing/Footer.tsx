import Link from 'next/link';
import { Sparkles, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#0A0A0A] pt-24 pb-12 rounded-t-[3rem] mt-[-3rem] border-t border-white/5 overflow-hidden">
            {/* Subtle Grid Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            {/* Top Fade overlay for grid */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">

                {/* Left Side: Brand & Status */}
                <div className="flex flex-col gap-8 flex-1 w-full max-w-sm">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-pink-400 transition-colors" />
                            <span className="text-3xl font-black tracking-tighter text-white">AURA</span>
                        </Link>
                        <p className="text-gray-400 font-light text-lg">
                            The premium peer-to-peer marketplace for event content.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-mono)] bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-gray-300">System Operational</span>
                    </div>
                </div>

                {/* Right Side: Links & Social */}
                <div className="flex flex-col md:items-end gap-12 w-full flex-1">
                    {/* Links */}
                    <div className="flex gap-8 md:gap-16 justify-start md:justify-end flex-wrap">
                        <div className="flex flex-col gap-4">
                            <h5 className="font-bold text-white mb-2 tracking-wide">Platform</h5>
                            <Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Browse Events</Link>
                            <Link href="/create" className="text-gray-400 hover:text-white transition-colors text-sm">Upload Photos</Link>
                            <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="font-bold text-white mb-2 tracking-wide">Creators</h5>
                            <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors text-sm">Join the Network</Link>
                            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Earnings Setup</Link>
                            <Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors text-sm">Quality Standards</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="font-bold text-white mb-2 tracking-wide">Legal</h5>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
                        </div>
                    </div>

                    {/* Socials & Copyright */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full pt-8 border-t border-white/10 gap-6">
                        <p className="text-gray-600 text-sm font-medium">
                            © {new Date().getFullYear()} Aura Technologies Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-purple-400 transition-colors bg-white/5 rounded-full hover:bg-white/10">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-pink-400 transition-colors bg-white/5 rounded-full hover:bg-white/10">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-400 transition-colors bg-white/5 rounded-full hover:bg-white/10">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
