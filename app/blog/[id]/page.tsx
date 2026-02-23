'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import BlogCard from '@/app/components/BlogCard';

interface Post {
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    authorAvatar: string;
    featured?: boolean;
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [related, setRelated] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Reading progress
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fetch post
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/posts/${id}`);
                const json = await res.json();
                if (json.success) {
                    setPost(json.data);
                    // Fetch related
                    const allRes = await fetch('/api/posts');
                    const allJson = await allRes.json();
                    if (allJson.success) {
                        setRelated(
                            allJson.data
                                .filter((p: Post) => p._id !== json.data._id && p.category === json.data.category)
                                .slice(0, 3)
                        );
                    }
                } else {
                    router.push('/');
                }
            } catch {
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, router]);

    const toCardPost = (p: Post) => ({ ...p, id: p._id });

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex items-center gap-3 text-zinc-500 text-sm">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading article…
                </div>
            </main>
        );
    }

    if (!post) return null;

    return (
        <main className="min-h-screen bg-zinc-950">
            {/* Reading Progress */}
            <div className="progress-bar" style={{ width: `${progress}%` }} />

            <Header />

            {/* ── Hero Image ── */}
            <div className="relative overflow-hidden" style={{ marginTop: 72, height: 'clamp(240px,42vh,460px)' }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.2) 0%, rgba(9,9,11,0.75) 70%, #09090b 100%)' }} />
            </div>

            {/* ── Article ── */}
            <article className="max-w-2xl mx-auto px-6 pb-28">

                {/* Back button */}
                <div className="relative z-10 -mt-6 mb-8">
                    <button onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 text-xs font-medium border border-zinc-800 bg-zinc-900/80 backdrop-blur-md hover:text-violet-400 hover:border-violet-500/40 transition-all cursor-pointer">
                        ← Back
                    </button>
                </div>

                {/* Header */}
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10">
                            {post.category}
                        </span>
                        <span className="text-zinc-600 text-xs">{post.date}</span>
                        <span className="text-zinc-700 text-xs">·</span>
                        <span className="text-zinc-600 text-xs">{post.readTime}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-zinc-100 mb-5">
                        {post.title}
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed font-light mb-7">
                        {post.description}
                    </p>

                    {/* Author card */}
                    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                        <img src={post.authorAvatar} alt={post.author}
                            className="w-11 h-11 rounded-full object-cover border-2 border-violet-500/30" />
                        <div className="flex-1 min-w-0">
                            <div className="text-zinc-100 text-sm font-semibold">{post.author}</div>
                            <div className="text-zinc-600 text-xs mt-0.5">Published {post.date}</div>
                        </div>
                        <div className="flex gap-2">
                            {['Twitter', 'LinkedIn'].map(s => (
                                <button key={s}
                                    className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 border border-zinc-700 hover:text-violet-400 hover:border-violet-500/40 transition-all cursor-pointer bg-transparent">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Divider */}
                <div className="h-px mb-10" style={{ background: 'linear-gradient(90deg,transparent,#27272a,transparent)' }} />

                {/* Content */}
                <div className="blog-content animate-fade-in-up delay-200">
                    {post.content.split('\n\n').filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                {/* Share row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-16 pt-8 border-t border-zinc-800/60">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10">
                        {post.category}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 text-xs font-medium mr-1">Share:</span>
                        {['𝕏', 'in', 'Link'].map(s => (
                            <button key={s}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 border border-zinc-800 bg-zinc-900/50 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30 transition-all cursor-pointer">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </article>

            {/* ── Related Posts ── */}
            {related.length > 0 && (
                <section className="max-w-5xl mx-auto px-6 pb-28 pt-12 border-t border-zinc-800/50">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-600 whitespace-nowrap">
                            More in {post.category}
                        </h2>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#27272a,transparent)' }} />
                        <Link href="/" className="text-violet-400 text-xs font-semibold no-underline whitespace-nowrap hover:opacity-75 transition-opacity">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {related.map(p => (
                            <BlogCard key={p._id} post={toCardPost(p)} />
                        ))}
                    </div>
                </section>
            )}

            <footer className="border-t border-zinc-800/40 py-10 text-center">
                <p className="text-zinc-600 text-xs">© 2026 MinimalBlog. All rights reserved.</p>
            </footer>
        </main>
    );
}
