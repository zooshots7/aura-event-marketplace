'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MARQUEE_EVENTS = [
    { name: "Tomorrowland 2026", uploads: "4,247", earned: "₹142,450", img: "https://images.unsplash.com/photo-1540039155732-6a71ab43c080?q=80&w=400&fit=crop" },
    { name: "Ultra Miami", uploads: "3,120", earned: "₹98,200", img: "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=400&fit=crop" },
    { name: "Coachella Valley", uploads: "8,940", earned: "₹340,500", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&fit=crop" },
    { name: "EDC Las Vegas", uploads: "5,450", earned: "₹210,000", img: "https://images.unsplash.com/photo-1533147670608-2a2f9776d3cb?q=80&w=400&fit=crop" },
    { name: "Burning Man", uploads: "2,890", earned: "₹85,600", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&fit=crop" },
    { name: "Lollapalooza", uploads: "4,100", earned: "₹120,000", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=400&fit=crop" },
];

export default function SocialProof() {
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        let ctx = gsap.context(() => {
            const totalWidth = scroller.scrollWidth / 2;

            gsap.to(scroller, {
                x: -totalWidth,
                duration: 30,
                ease: "none",
                repeat: -1
            });
        }, scrollerRef);

        const pause = () => gsap.globalTimeline.pause();
        const resume = () => gsap.globalTimeline.resume();

        scroller.addEventListener("mouseenter", pause);
        scroller.addEventListener("mouseleave", resume);

        return () => {
            ctx.revert();
            scroller.removeEventListener("mouseenter", pause);
            scroller.removeEventListener("mouseleave", resume);
        };
    }, []);

    const repeatEvents = [...MARQUEE_EVENTS, ...MARQUEE_EVENTS];

    return (
        <section className="relative z-10 py-24 bg-black overflow-hidden border-y border-white/5">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div ref={scrollerRef} className="flex gap-6 w-max pl-6 cursor-grab active:cursor-grabbing">
                {repeatEvents.map((event, idx) => (
                    <div
                        key={idx}
                        className="w-[300px] h-[200px] rounded-2xl relative overflow-hidden group flex-shrink-0 border border-white/10"
                    >
                        <img
                            src={event.img}
                            className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 group-hover:scale-110 transition-all duration-500"
                            alt={event.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                            <h4 className="text-xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform">{event.name}</h4>
                            <p className="text-xs text-gray-300 font-[family-name:var(--font-mono)] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">
                                {event.uploads} uploads • <span className="text-green-400">{event.earned}</span> earned
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
