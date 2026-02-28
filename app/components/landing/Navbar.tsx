'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const scrollUnsubscribe = scrollY.onChange((latest) => {
            setIsScrolled(latest > 100);
        });

        return () => {
            unsubscribe();
            scrollUnsubscribe();
        };
    }, [scrollY]);

    return (
        <motion.nav
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.div
                className={`flex items-center justify-between px-6 py-4 rounded-[2rem] border transition-all duration-300 ease-out`}
                initial={false}
                animate={{
                    backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
                    backdropFilter: isScrolled ? 'blur(24px)' : 'blur(0px)',
                    borderColor: isScrolled ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                }}
                style={{
                    boxShadow: isScrolled ? '0 10px 40px -10px rgba(0,0,0,0.5)' : 'none',
                }}
            >
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AURA
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/events" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-purple-200 hover:text-white' : 'text-gray-300 hover:text-white'}`}>
                            Browse Events
                        </Link>
                        <Link href="/create" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-purple-200 hover:text-white' : 'text-gray-300 hover:text-white'}`}>
                            Create Event
                        </Link>
                        <Link href="#how-it-works" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-purple-200 hover:text-white' : 'text-gray-300 hover:text-white'}`}>
                            How It Works
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                {user.displayName || user.email}
                            </span>
                            <Link href="/events" className="hidden sm:block text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={() => auth.signOut()}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all hover:scale-105"
                            >
                                Start Earning
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
}
