'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import BlogCard from '@/app/components/BlogCard';
import { useAuth } from '@/context/AuthContext';

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
    likes?: string[];
    ratings?: { userId: string; rating: number }[];
    comments?: {
        userId: string;
        userName: string;
        userAvatar: string;
        text: string;
        createdAt: string;
    }[];
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [related, setRelated] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { user } = useAuth();
    const [isLiking, setIsLiking] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    const isLiked = user && post?.likes?.includes(user.id);
    const userRating = user && post?.ratings?.find((r: any) => r.userId === user.id)?.rating || 0;

    const postRatings = post?.ratings || [];
    const avgRating = postRatings.length > 0
        ? (postRatings.reduce((acc: number, r: any) => acc + r.rating, 0) / postRatings.length).toFixed(1)
        : "0.0";

    const handleRate = async (rating: number) => {
        if (!user) {
            router.push('/auth');
            return;
        }

        if (isRating || !post) return;

        setIsRating(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/rating`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating }),
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, ratings: data.ratings } as Post);
            }
        } catch (err) {
            console.error('Error rating post:', err);
        } finally {
            setIsRating(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            router.push('/auth');
            return;
        }

        if (isLiking || !post) return;

        setIsLiking(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, likes: data.likes } as Post);
            }
        } catch (err) {
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/auth');
            return;
        }

        if (isCommenting || !commentText.trim() || !post) return;

        setIsCommenting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, comments: data.comments } as Post);
                setCommentText('');
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setIsCommenting(false);
        }
    };

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
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-0.5 text-amber-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill={star <= Math.round(Number(avgRating)) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="transition-all"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-medium">
                                {avgRating} Avg · {postRatings.length} Ratings
                            </span>
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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-600 text-xs font-medium">Rate:</span>
                            <div className="flex items-center gap-1 group/stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        disabled={isRating}
                                        className="bg-transparent border-0 p-0 text-amber-500 hover:scale-110 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill={star <= (userRating || 0) ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="transition-all group-hover:fill-amber-500/40"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-4 w-px bg-zinc-800" />
                        <span className="text-zinc-600 text-xs font-medium mr-1">Share:</span>
                        {['𝕏', 'in', 'Link'].map(s => (
                            <button key={s}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 border border-zinc-800 bg-zinc-900/50 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30 transition-all cursor-pointer">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Comments Section ── */}
                <div id="comments" className="mt-16 pt-16 border-t border-zinc-800/60 animate-fade-in-up delay-300">
                    <h3 className="text-xl font-bold text-zinc-100 mb-8 flex items-center gap-3">
                        Comments
                        <span className="text-zinc-500 text-sm font-normal">({post.comments?.length || 0})</span>
                    </h3>

                    {/* Comment Form */}
                    <form onSubmit={handleComment} className="mb-12">
                        <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                            {user ? (
                                <img src={user.avatar || post.authorAvatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-700" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center text-zinc-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={user ? "Write a thoughtful comment..." : "Sign in to join the conversation"}
                                    rows={2}
                                    className="w-full bg-transparent border-0 focus:ring-0 text-zinc-200 placeholder:text-zinc-600 resize-none text-sm py-2"
                                    onFocus={(e) => { if (!user) router.push('/auth'); }}
                                />
                                <div className="flex justify-end pt-2 border-t border-zinc-800/50 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isCommenting || !commentText.trim() || !user}
                                        className="px-5 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        {isCommenting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-8">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.slice().reverse().map((comment, i) => (
                                <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                    <img src={comment.userAvatar || post.authorAvatar} alt={comment.userName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-800" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-zinc-200">{comment.userName}</span>
                                            <span className="text-[10px] text-zinc-600">· {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 px-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/30 border-dashed">
                                <p className="text-zinc-600 text-sm">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
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
