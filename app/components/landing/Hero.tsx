'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, Grid3x3, Upload } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 1000], [0, 300]); // 0.3x speed difference

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Staggered text reveal
            gsap.from('.hero-text-elem', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
        >
            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: yParallax }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1540039155732-6a71ab43c080?q=80&w=2800&auto=format&fit=crop"
                    alt="Concert Crowd"
                    fill
                    className="object-cover object-[center_30%] opacity-40"
                    priority
                    sizes="100vw"
                />
                {/* Heavy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-black/80 to-[#0A0A0A]" />
            </motion.div>

            {/* Animated Floating Blob */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(124,58,237,0.3)_0%,_transparent_70%)] rounded-full mix-blend-screen pointer-events-none z-0 filter blur-3xl animate-pulse"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center mt-12 md:mt-0 flex flex-col items-center">
                {/* Badge */}
                <div className="hero-text-elem inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-purple-900/20">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">The New Standard for Event Content</span>
                </div>

                {/* Headlines */}
                <div ref={textRef} className="flex flex-col items-center gap-2 mb-8">
                    <h1 className="hero-text-elem text-6xl md:text-8xl lg:text-[7rem] font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl">
                        Upload. Discover.
                    </h1>
                    <h1 className="hero-text-elem text-6xl md:text-8xl lg:text-[7rem] font-black leading-[1.05] tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-[family-name:var(--font-playfair)] italic pb-2 pr-4">
                        Earn Together.
                    </h1>
                </div>

                {/* Subhead */}
                <p className="hero-text-elem text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed">
                    The premium peer-to-peer marketplace for event content.
                </p>

                {/* CTAs */}
                <div className="hero-text-elem flex flex-col sm:flex-row gap-5 items-center justify-center">
                    <Link
                        href="/auth/signup"
                        className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-bold transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center gap-2"
                    >
                        Start Earning
                    </Link>
                    <Link
                        href="/events"
                        className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-full text-lg font-bold text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                    >
                        <Grid3x3 className="w-5 h-5 opacity-70" />
                        Browse Events
                    </Link>
                </div>
            </div>

            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
        </section>
    );
}
