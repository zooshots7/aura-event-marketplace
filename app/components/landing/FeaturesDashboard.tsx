'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { IndianRupee, Tag, Camera, ScanFace, TrendingUp } from 'lucide-react';

export default function FeaturesDashboard() {
    const [earnings, setEarnings] = useState(0);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        let animationFrameId: number;
        let startTime: number | null = null;

        if (isInView) {
            const start = 0;
            const end = 2847;
            const duration = 2000;

            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const ease = 1 - Math.pow(1 - progress, 4);

                setEarnings(Math.floor(start + (end - start) * ease));

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isInView]);

    return (
        <section className="relative z-10 container mx-auto px-6 py-32 bg-black">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black mb-20 text-center tracking-tight">
                    The <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Precision</span> Artifacts
                </h2>

                <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Card 1: Passive Income */}
                    <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between border-white/5 hover:border-purple-500/30 transition-colors group h-[400px]">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-bold mb-6">
                                <IndianRupee className="w-3 h-3" /> Automatic Payouts
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Passive Income</h3>
                            <p className="text-gray-400 text-sm">Upload once, earn forever. Real-time revenue tracking straight to your bank.</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 mt-6 flex-1 flex flex-col justify-end relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="text-sm text-gray-400 mb-1 flex items-center justify-between">
                                Current Balance
                                <span className="text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.4%</span>
                            </div>
                            <div className="text-5xl font-black text-white font-[family-name:var(--font-mono)] tracking-tighter flex items-center">
                                <span className="text-3xl text-gray-500 mr-1">₹</span>
                                {earnings.toLocaleString()}
                            </div>

                            {/* Decorative Chart Line */}
                            <svg className="w-full h-16 mt-4 opacity-50 text-purple-500" viewBox="0 0 200 50" preserveAspectRatio="none">
                                <motion.path
                                    d="M0,50 L20,40 L40,45 L60,20 L80,30 L100,10 L120,25 L140,5 L160,15 L180,0 L200,10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: AI Auto-Tagging */}
                    <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between border-white/5 hover:border-blue-500/30 transition-colors group h-[400px]">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs font-bold mb-6">
                                <Tag className="w-3 h-3" /> Zero Manual Work
                            </div>
                            <h3 className="text-2xl font-bold mb-2">The Neural Engine</h3>
                            <p className="text-gray-400 text-sm">Every photo is automatically processed for faces, objects, and quality framing.</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 mt-6 flex-1 relative overflow-hidden group-hover:bg-white/10 transition-colors">
                            <div className="absolute inset-0 p-4">
                                <div className="w-full h-full bg-gray-900 rounded-xl relative overflow-hidden border border-white/10">
                                    <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Group" />

                                    {/* Face Detection Boxes */}
                                    <motion.div
                                        className="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-blue-400 rounded-lg"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                    />
                                    <motion.div
                                        className="absolute top-[30%] right-[30%] w-10 h-10 border-2 border-blue-400 rounded-lg"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7, type: "spring" }}
                                    />

                                    {/* Tags Stack */}
                                    <div className="absolute bottom-3 left-3 flex flex-col gap-2">
                                        {[
                                            { icon: <ScanFace className="w-3 h-3" />, text: "2 Faces" },
                                            { icon: <Tag className="w-3 h-3" />, text: "Group Shot" },
                                            { icon: <span className="font-bold">✨</span>, text: "Quality: 9.2" }
                                        ].map((tag, i) => (
                                            <motion.div
                                                key={i}
                                                className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1.5 w-fit border border-white/10 shadow-xl"
                                                initial={{ x: -20, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 1 + (i * 0.2) }}
                                            >
                                                {tag.icon} {tag.text}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Thousands of Angles */}
                    <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between border-white/5 hover:border-pink-500/30 transition-colors group h-[400px] lg:col-span-1 md:col-span-2">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full text-xs font-bold mb-6">
                                <Camera className="w-3 h-3" /> Crowd-Sourced Coverage
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Thousands of Angles</h3>
                            <p className="text-gray-400 text-sm">Every attendee is a potential photographer. The grid updates in real-time as the event unfolds.</p>
                        </div>

                        <div className="mt-6 flex-1 relative overflow-hidden rounded-2xl">
                            <MosaicGrid />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Intermittent updating 3x3 grid
function MosaicGrid() {
    const images = [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540039155732-6a71ab43c080?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533147670608-2a2f9776d3cb?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563240619-44ce0252ad89?q=80&w=200&auto=format&fit=crop"
    ];

    const [activeIndices, setActiveIndices] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    useEffect(() => {
        // Randomly update an image with a blink effect
        const interval = setInterval(() => {
            const idx = Math.floor(Math.random() * 9);
            setActiveIndices(prev => prev.map((val, i) => i === idx ? (val + 1) % images.length : val));
        }, 2000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="grid grid-cols-3 gap-2 h-full">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                    key={`${i}-${activeIndices[i]}`}
                    className="rounded-lg overflow-hidden relative cursor-pointer group/item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src={images[activeIndices[i]]}
                        className="w-full h-full object-cover filter brightness-75 group-hover/item:brightness-110 group-hover/item:scale-110 transition-all duration-300"
                        alt="Grid item"
                    />
                </motion.div>
            ))}
        </div>
    )
}
