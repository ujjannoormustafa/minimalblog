'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '../data';
import AddArticleModal from './AddArticleModal';
import { useAuth } from '@/context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => { await logout(); router.push('/'); };

    // Close user dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800' : 'bg-transparent border-b border-transparent'}`}>
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between" style={{ height: 72 }}>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            M
                        </div>
                        <span className="text-lg font-bold text-zinc-100 tracking-tight">
                            Minimal<span className="font-light text-zinc-500">Blog</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="nav-link">Home</Link>

                        {/* Categories dropdown */}
                        <div className="relative"
                            onMouseEnter={() => setCatOpen(true)}
                            onMouseLeave={() => setCatOpen(false)}>
                            <span className="nav-link cursor-pointer flex items-center gap-1 select-none">
                                Categories
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    className={`opacity-60 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}>
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>

                            {catOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl min-w-44 shadow-2xl shadow-black/60 animate-fade-in z-50">
                                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                        <Link key={cat} href={`/?category=${cat}`}
                                            className="block px-4 py-2 text-sm font-medium text-zinc-400 rounded-xl hover:bg-violet-500/10 hover:text-violet-400 transition-all no-underline">
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/about" className="nav-link">About</Link>

                        {user ? (
                            <>
                                <button
                                    id="open-add-article"
                                    onClick={() => setAddOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:-translate-y-px transition-all duration-200 cursor-pointer border-0"
                                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                                    Write
                                </button>
                                {/* User avatar dropdown */}
                                <div className="relative" ref={userRef}>
                                    <button onClick={() => setUserOpen(v => !v)}
                                        className="w-8 h-8 rounded-full border-2 border-violet-500/40 overflow-hidden flex items-center justify-center bg-violet-500/20 text-violet-400 font-bold text-sm cursor-pointer focus:outline-none">
                                        {user.avatar
                                            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            : user.name.charAt(0).toUpperCase()}
                                    </button>
                                    {userOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-48 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 animate-fade-in z-50">
                                            <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                                                <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
                                                <p className="text-[10px] text-zinc-600 truncate">{user.email}</p>
                                            </div>
                                            <Link href="/dashboard" onClick={() => setUserOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 rounded-xl hover:bg-violet-500/10 hover:text-violet-400 transition-all no-underline">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                                Dashboard
                                            </Link>
                                            <button onClick={() => { setUserOpen(false); setEditUserOpen(true); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 rounded-xl hover:bg-violet-500/10 hover:text-violet-400 transition-all cursor-pointer border-0 bg-transparent text-left">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                Edit Profile
                                            </button>
                                            <button onClick={() => { setUserOpen(false); handleLogout(); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer border-0 bg-transparent text-left">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link href="/auth"
                                className="px-5 py-2 rounded-full text-sm font-semibold text-white no-underline hover:opacity-90 hover:-translate-y-px transition-all duration-200"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                                Sign In
                            </Link>
                        )}
                    </nav>

                    {/* Mobile hamburger */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-zinc-100"
                        aria-label="Toggle menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {mobileOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 animate-fade-in-up">
                        {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }].map(item => (
                            <Link key={item.label} href={item.href}
                                className="block py-3 text-zinc-400 text-sm border-b border-zinc-800/60 no-underline hover:text-zinc-100 transition-colors"
                                onClick={() => setMobileOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                            <Link key={cat} href={`/?category=${cat}`}
                                className="block py-3 text-zinc-400 text-sm border-b border-zinc-800/60 no-underline hover:text-violet-400 transition-colors"
                                onClick={() => setMobileOpen(false)}>
                                {cat}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <button
                                    onClick={() => { setAddOpen(true); setMobileOpen(false); }}
                                    className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white cursor-pointer border-0"
                                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                                    Write Article
                                </button>
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                                    className="block py-3 text-zinc-400 text-sm border-b border-zinc-800/60 no-underline hover:text-violet-400 transition-colors">
                                    Dashboard
                                </Link>
                                <button onClick={() => { setEditUserOpen(true); setMobileOpen(false); }}
                                    className="w-full text-left py-3 text-zinc-400 text-sm border-b border-zinc-800/60 no-underline hover:text-violet-400 transition-colors cursor-pointer border-0 bg-transparent">
                                    Edit Profile
                                </button>
                                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="w-full text-left py-3 text-zinc-500 text-sm cursor-pointer border-0 bg-transparent hover:text-red-400 transition-colors">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/auth" onClick={() => setMobileOpen(false)}
                                className="block mt-3 text-center py-3 rounded-full text-sm font-semibold text-white no-underline"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {addOpen && (
                <AddArticleModal
                    onClose={() => setAddOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {editUserOpen && (
                <EditProfileModal
                    onClose={() => setEditUserOpen(false)}
                    onSuccess={() => { }}
                />
            )}
        </>
    );
}
