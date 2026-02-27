'use client';

import { useRef, useState, MouseEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function PricingCTA() {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Dampen the movement
        setPosition({ x: x * 0.2, y: y * 0.2 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <section className="relative z-10 py-40 bg-black overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-1/2 left-1/4 w-[50vw] h-[50vw] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
                <div className="absolute top-1/2 right-1/4 w-[40vw] h-[40vw] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <motion.h2
                    className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tight mb-8 leading-[1.05]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Start Earning <br />
                    <span className="font-[family-name:var(--font-playfair)] italic bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent pr-4 pb-4">
                        Fast.
                    </span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Link
                        href="/auth/signup"
                        ref={buttonRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-2xl font-bold tracking-wide transition-shadow hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] group mb-6"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
                        }}
                    >
                        Create Your Account
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                <motion.p
                    className="text-gray-400 text-lg font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Join <strong className="text-white">1,200+ creators</strong> earning from their event photos
                </motion.p>
            </div>
        </section>
    );
}
