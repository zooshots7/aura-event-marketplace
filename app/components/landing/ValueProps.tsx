'use client';

import { motion } from 'framer-motion';
import { Camera, MessageSquare, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ValueProps() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            gsap.from('.vp-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative z-10 container mx-auto px-6 py-32 border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        className="text-5xl md:text-[4rem] font-black mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        A Complete <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Paradigm Shift</span>.
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Traditional photography is gatekept and scattered. Aura introduces a unified <strong className="text-white font-medium">peer-to-peer ecosystem</strong> valuing every perspective.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-8 w-full">
                    {/* Card 1: Free Sharing */}
                    <div className="vp-card group relative p-10 rounded-[2.5rem] bg-gray-900/50 border border-gray-800 hover:border-red-900/50 transition-colors flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-bl-full blur-2xl" />
                        <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-8 border border-gray-700">
                            <MessageSquare className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Free Sharing</h3>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Photos dissolve into WhatsApp groups and hard drives. Unsearchable, unorganized, and slowly forgotten.
                        </p>
                    </div>

                    {/* Card 2: Pro Photographers */}
                    <div className="vp-card group relative p-10 rounded-[2.5rem] bg-orange-950/20 border border-orange-900/40 hover:border-orange-500/50 transition-colors flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-900/10 rounded-br-full blur-2xl" />
                        <div className="w-20 h-20 bg-orange-900/30 rounded-2xl flex items-center justify-center mb-8 border border-orange-800/50">
                            <Camera className="w-10 h-10 text-orange-500/70" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Pro Photographers</h3>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Cost-prohibitive with a single point of view. You pay exorbitant fees for a curated fraction of the event.
                        </p>
                    </div>

                    {/* Card 3: The Future (Aura) */}
                    <motion.div
                        className="vp-card group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-pink-500/40 flex flex-col items-center text-center shadow-[0_0_40px_rgba(236,72,153,0.1)] cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Animated Gradient Border Layer */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />

                        <div className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] z-20 overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative text-white z-10 shadow-sm">50% Creator Split</span>
                        </div>

                        <div className="w-20 h-20 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-8 border border-pink-400/50 relative z-10 group-hover:bg-pink-500/30 transition-colors">
                            <Sparkles className="w-10 h-10 text-pink-300 animate-pulse" />
                        </div>

                        <h3 className="text-2xl font-black mb-4 text-white relative z-10 tracking-tight">Aura Marketplace</h3>
                        <p className="text-gray-300 text-base leading-relaxed relative z-10">
                            Thousands of lenses. One searchable grid. AI-tagged perfection. You earn for every download.
                        </p>

                        <motion.div
                            className="mt-6 px-6 py-2 rounded-full border border-white/20 text-sm font-semibold text-white/90 relative z-10 backdrop-blur-sm bg-white/5"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            The Future of Moments
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
