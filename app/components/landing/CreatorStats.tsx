'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CreatorStats() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const [counters, setCounters] = useState({
        creators: 0,
        assets: 0,
        paid: 0
    });

    useEffect(() => {
        const frameIds: number[] = [];

        if (isInView) {
            const animate = (start: number, end: number, key: keyof typeof counters, duration = 2000) => {
                let startTime: number | null = null;

                const step = (currentTime: number) => {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out

                    setCounters(prev => ({
                        ...prev,
                        [key]: Math.floor(start + (end - start) * ease)
                    }));

                    if (progress < 1) {
                        frameIds.push(requestAnimationFrame(step));
                    }
                };
                frameIds.push(requestAnimationFrame(step));
            };

            animate(0, 1240, 'creators', 2000);
            animate(0, 150000, 'assets', 2500);
            animate(0, 24000, 'paid', 2500);
        }

        return () => {
            frameIds.forEach(id => cancelAnimationFrame(id));
        };
    }, [isInView]);

    return (
        <section className="relative z-10 container mx-auto px-6 py-32 bg-[#050505]">
            <div
                ref={containerRef}
                className="max-w-6xl mx-auto glass-panel rounded-[3rem] p-16 md:p-24 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01]"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.1)_0%,_transparent_70%)] pointer-events-none" />

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Built for the <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Creator Economy</span></h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Join the rapidly growing network of photographers scaling their event coverage.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="text-5xl md:text-7xl font-black text-white font-[family-name:var(--font-mono)] tracking-tighter mb-4 text-shadow-glow">
                            {counters.creators.toLocaleString()}
                            <span className="text-purple-500 text-4xl ml-1">+</span>
                        </div>
                        <p className="text-xl text-gray-200 font-bold mb-2">Active Lenses</p>
                        <p className="text-gray-500 text-sm">Shooting globally</p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-5xl md:text-7xl font-black text-white font-[family-name:var(--font-mono)] tracking-tighter mb-4 text-shadow-glow">
                            {counters.assets.toLocaleString()}
                            <span className="text-blue-500 text-4xl ml-1">+</span>
                        </div>
                        <p className="text-xl text-gray-200 font-bold mb-2">Moments Captured</p>
                        <p className="text-gray-500 text-sm">Searchable and organized</p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-5xl md:text-7xl font-black text-white font-[family-name:var(--font-mono)] tracking-tighter mb-4 text-shadow-glow">
                            <span className="text-3xl text-gray-400 mr-1">$</span>
                            {counters.paid.toLocaleString()}
                            <span className="text-pink-500 text-4xl ml-1">+</span>
                        </div>
                        <p className="text-xl text-gray-200 font-bold mb-2">Creator Earnings</p>
                        <p className="text-gray-500 text-sm">Paid out seamlessly</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
