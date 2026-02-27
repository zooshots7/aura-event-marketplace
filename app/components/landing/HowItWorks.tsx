'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, Zap, DollarSign, Image as ImageIcon, CheckCircle2, ScanFace, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative z-10 bg-[#050505] py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-black text-center mb-32 tracking-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Protocol</span></h2>

                <div className="flex flex-col gap-40 max-w-7xl mx-auto">
                    {/* Step 1: Upload & Earn */}
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Visual Artifact (Left) */}
                        <motion.div
                            className="w-full lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="glass-panel p-8 rounded-[2rem] border-white/10 relative shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                                {/* Upload Zone */}
                                <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center bg-purple-500/5 hover:bg-purple-500/10 transition-colors h-48">
                                    <Upload className="w-12 h-12 text-purple-400 mb-4 animate-bounce" />
                                    <p className="font-semibold text-lg text-white">Drop your memory cards</p>
                                    <p className="text-sm text-gray-400">RAW, JPEG, MP4 supported</p>
                                </div>

                                {/* Simulated Uploads */}
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-black/40 rounded-xl p-4 flex items-center gap-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.2 }}
                                        >
                                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium">DSC0{1000 + i}.jpg</span>
                                                    <span className="text-xs text-purple-400 font-[family-name:var(--font-mono)]"><CheckCircle2 className="w-3 h-3 inline mr-1" />Processed</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                        initial={{ width: "0%" }}
                                                        whileInView={{ width: "100%" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.5, delay: i * 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Floating Tags */}
                                <motion.div
                                    className="absolute -right-6 -bottom-6 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-wrap gap-2 max-w-[200px]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <span className="text-xs font-medium px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">Golden Hour</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full flex items-center gap-1"><ScanFace className="w-3 h-3" /> Face Match</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Sharpness 9.8</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Copy (Right) */}
                        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-xs md:text-sm font-medium text-purple-300">
                                <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                                50% Creator Split
                            </div>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Upload in seconds.<br />
                                <span className="text-gray-400">Earn in perpetuity.</span>
                            </h3>
                            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                                Drop your raw gallery. Our neural engine automatically tags faces, categorizes moments, and grades quality. Your portfolio is instantly live and searchable to attendees.
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Discover Magic */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
                        {/* Visual Artifact (Right) */}
                        <motion.div
                            className="w-full lg:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="glass-panel p-2 rounded-[2rem] border-white/10 relative shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden">
                                <div className="bg-[#0A0A0A] rounded-[1.8rem] p-6 h-full border border-white/5">
                                    {/* Search Bar */}
                                    <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-5 py-4 mb-6 relative hover:bg-white/15 transition-colors">
                                        <Search className="w-5 h-5 text-blue-400" />
                                        {/* Simulated Typing */}
                                        <TypewriterText texts={["sunset bride dancing", "group selfie stage", "blue lighting concert"]} />
                                        <div className="absolute right-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-bold">AI Search</div>
                                    </div>

                                    {/* Results Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=800&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1533147670608-2a2f9776d3cb?q=80&w=800&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"
                                        ].map((src, idx) => (
                                            <motion.div
                                                key={idx}
                                                className={`rounded-xl overflow-hidden bg-white/5 border border-white/10 relative ${idx === 0 ? "col-span-2 h-40" : "h-28"}`}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                            >
                                                <img src={src} className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 hover:scale-110" alt="Result" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Copy (Left) */}
                        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 mt-10 lg:mt-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-full text-xs md:text-sm font-medium text-blue-300">
                                <Search className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                                Semantic Search
                            </div>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Stop scrolling.<br />
                                <span className="text-gray-400">Start finding.</span>
                            </h3>
                            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                                Forget looking through thousands of unorganized files. Use natural language or simply upload a selfie to instantly find every angle you were captured from.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Unlock Quality */}
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Visual Artifact (Left) */}
                        <motion.div
                            className="w-full lg:w-1/2"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative rounded-[2rem] overflow-hidden group shadow-[0_0_50px_rgba(236,72,153,0.1)] border border-white/10 hover:border-pink-500/30 transition-colors aspect-[4/3]">
                                {/* Background Image (Watermarked) */}
                                <div className="absolute inset-0">
                                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover filter blur-[2px] opacity-70 grayscale" alt="Watermark" />
                                    {/* Simulated Watermark grid */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48dGV4dCB4PSIzMCIgeT0iNTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRyYW5zZm9ybT0icm90YXRoKC00NSw1MCw1MCkiPkFVUkE8L3RleHQ+PC9zdmc+')] opacity-50" />
                                </div>

                                {/* Slider Cover (HD) */}
                                <motion.div
                                    className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-pink-500 z-10"
                                    initial={{ width: "20%" }}
                                    whileInView={{ width: "80%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                >
                                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop" className="absolute top-0 left-0 w-[800px] h-full object-cover max-w-none filter contrast-125 saturate-150" alt="HD Unwatermarked" />

                                    {/* Floating Price Tag that appears on HD side */}
                                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-pink-600 text-white font-bold rounded-lg shadow-2xl flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> ₹50 HD
                                    </div>
                                </motion.div>

                                {/* Center Handle Graphic */}
                                <motion.div
                                    className="absolute inset-y-0 flex items-center justify-center z-20 pointer-events-none"
                                    initial={{ left: "20%" }}
                                    whileInView={{ left: "80%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                >
                                    <div className="w-8 h-12 bg-white rounded-full flex items-center justify-center shadow-lg -ml-4">
                                        <ChevronRight className="w-5 h-5 text-black" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Copy (Right) */}
                        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 mt-10 lg:mt-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/20 rounded-full text-xs md:text-sm font-medium text-pink-300">
                                <Zap className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                                Instant Download
                            </div>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Preview freely.<br />
                                <span className="text-gray-400">Unlock brilliance.</span>
                            </h3>
                            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                                Browse watermarked previews for absolutely free. When you find the perfect shot, simple micro-transactions unlock the uncompressed, unwatermarked master file instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Helper typing effect component
function TypewriterText({ texts }: { texts: string[] }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout = setTimeout(() => setBlink(!blink), 500);
        return () => clearTimeout(timeout);
    }, [blink]);

    // Typing effect
    useEffect(() => {
        if (subIndex === texts[index].length + 1 && !isDeleting) {
            setTimeout(() => setIsDeleting(true), 1500);
            return;
        }

        if (subIndex === 0 && isDeleting) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % texts.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
        }, Math.max(isDeleting ? 30 : 100, Math.random() * 150));

        return () => clearTimeout(timeout);
    }, [subIndex, index, isDeleting, texts]);

    return (
        <div className="text-white text-lg font-medium flex-1 overflow-hidden whitespace-nowrap">
            {`${texts[index].substring(0, subIndex)}${blink ? '|' : ' '}`}
        </div>
    );
}
