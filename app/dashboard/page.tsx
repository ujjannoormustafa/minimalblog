'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '../data';
import AddArticleModal from '@/app/components/AddArticleModal';
import EditProfileModal from '@/app/components/EditProfileModal';

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
    featured: boolean;
    createdAt: string;
}

const CONTENT_CATS = CATEGORIES.filter(c => c !== 'All');

/* ─── Edit Modal ──────────────────────────────────────────── */
function EditModal({ post, onClose, onSaved }: { post: Post; onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
        category: post.category,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim() || !form.image.trim()) {
            setError('Title, content, and image URL are required.'); return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) { onSaved(); onClose(); }
            else setError(json.error || 'Failed to update.');
        } catch { setError('Network error.'); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 shadow-2xl animate-fade-in-up"
                style={{ background: 'rgba(18,18,22,0.97)' }}>
                <div className="sticky top-0 flex items-center justify-between px-8 py-5 border-b border-zinc-800/70"
                    style={{ background: 'rgba(18,18,22,0.97)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-zinc-100">Edit Article</span>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer border-0 bg-transparent">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={save} className="px-8 py-6 space-y-4">
                    {[
                        { label: 'Title', name: 'title', type: 'input' },
                        { label: 'Image URL', name: 'image', type: 'input' },
                    ].map(f => (
                        <div key={f.name}>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">{f.label}</label>
                            <input name={f.name} value={(form as any)[f.name]} onChange={handle}
                                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-all" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Category</label>
                        <select name="category" value={form.category} onChange={handle}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500 transition-all cursor-pointer">
                            {CONTENT_CATS.map(c => <option key={c} value={c} style={{ background: '#18181b' }}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Description</label>
                        <textarea name="description" value={form.description} onChange={handle} rows={2}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500 transition-all resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Content</label>
                        <textarea name="content" value={form.content} onChange={handle} rows={8}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500 transition-all resize-none leading-relaxed" />
                    </div>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-full text-sm font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-200 transition-all cursor-pointer bg-transparent">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer border-0 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Delete Confirm Modal ────────────────────────────────── */
function DeleteModal({ post, onClose, onDeleted }: { post: Post; onClose: () => void; onDeleted: () => void }) {
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const doDelete = async () => {
        setDeleting(true);
        try {
            await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
            onDeleted(); onClose();
        } catch { setDeleting(false); }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-sm rounded-3xl border border-zinc-800 p-8 text-center animate-fade-in-up"
                style={{ background: 'rgba(18,18,22,0.97)' }}>
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Delete Article?</h3>
                <p className="text-zinc-500 text-sm mb-7 leading-relaxed">
                    "<span className="text-zinc-300">{post.title}</span>" will be permanently deleted. This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-full text-sm font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer bg-transparent">
                        Cancel
                    </button>
                    <button onClick={doDelete} disabled={deleting}
                        className="flex-1 py-2.5 rounded-full text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer border-0 disabled:opacity-50">
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Stat Card ───────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, gradient }: {
    icon: React.ReactNode; label: string; value: string | number; sub: string; gradient: string;
}) {
    return (
        <div className="glass rounded-2xl p-6 border border-zinc-800 flex flex-col gap-4 card-hover">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-black text-zinc-100 tracking-tighter">{value}</div>
                <div className="text-sm font-semibold text-zinc-300 mt-0.5">{label}</div>
                <div className="text-xs text-zinc-600 mt-1">{sub}</div>
            </div>
        </div>
    );
}

/* ─── Dashboard ───────────────────────────────────────────── */
export default function Dashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const [deletePost, setDeletePost] = useState<Post | null>(null);
    const [filterCat, setFilterCat] = useState('All');

    useEffect(() => {
        if (!authLoading && !user) router.replace('/auth');
    }, [authLoading, user, router]);

    const fetchPosts = useCallback(async () => {
        setPostsLoading(true);
        try {
            const res = await fetch(`/api/posts/mine?t=${Date.now()}`);
            const json = await res.json();
            console.log('Dashboard posts response:', json);
            if (json.success) setPosts(json.data);
        } catch (err) {
            console.error('Fetch posts error:', err);
        }
        finally { setPostsLoading(false); }
    }, []);

    useEffect(() => {
        if (user) fetchPosts();
    }, [user, fetchPosts]);

    const handleLogout = async () => { await logout(); router.push('/'); };

    if (authLoading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-zinc-600 text-sm animate-pulse">Loading…</div>
        </div>
    );
    if (!user) return null;

    // Stats
    const total = posts.length;
    const categories = [...new Set(posts.map(p => p.category))].length;
    const latestDate = posts[0]?.date ?? '—';
    const words = posts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0);
    const minRead = Math.ceil(words / 200);

    const filtered = filterCat === 'All' ? posts : posts.filter(p => p.category === filterCat);
    const usedCats = ['All', ...new Set(posts.map(p => p.category))];

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* ── Top Nav ── */}
            <header className="border-b border-zinc-800/60 sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: 68 }}>
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>M</div>
                        <span className="text-base font-bold text-zinc-100 tracking-tight hidden sm:block">
                            Minimal<span className="font-light text-zinc-500">Blog</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setAddOpen(true)} id="dash-add-article"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all cursor-pointer border-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Article
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                            <button
                                onClick={() => setEditProfileOpen(true)}
                                className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm overflow-hidden group relative cursor-pointer"
                                title="Edit Profile"
                            >
                                {user.avatar
                                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                    : user.name.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </div>
                            </button>
                            <span className="text-zinc-300 text-sm font-medium hidden sm:block">{user.name}</span>
                        </div>
                        <button onClick={handleLogout}
                            className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-0 p-1"
                            title="Sign out">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* ── Welcome ── */}
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight">
                        Hello, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Here's an overview of your writing journey.</p>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 animate-fade-in-up delay-100">
                    <StatCard
                        gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                        label="Total Articles"
                        value={total}
                        sub={total === 0 ? 'Start writing today!' : `Latest: ${latestDate}`}
                    />
                    <StatCard
                        gradient="linear-gradient(135deg,#ec4899,#be185d)"
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        label="Total Read Time"
                        value={`${minRead} min`}
                        sub={`Across ${words.toLocaleString()} words written`}
                    />
                    <StatCard
                        gradient="linear-gradient(135deg,#06b6d4,#0891b2)"
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M4 8h16M8 4v4" /></svg>}
                        label="Categories Used"
                        value={categories || 0}
                        sub={categories ? `Out of 4 available` : 'No categories yet'}
                    />
                </div>

                {/* ── My Articles ── */}
                <div className="animate-fade-in-up delay-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-600">My Articles</h2>
                        {posts.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {usedCats.map(cat => (
                                    <button key={cat} onClick={() => setFilterCat(cat)}
                                        className={`text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border cursor-pointer transition-all duration-200
                                            ${filterCat === cat
                                                ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                                                : 'border-zinc-700 text-zinc-500 bg-transparent hover:border-violet-500/40 hover:text-violet-400'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {postsLoading ? (
                        <div className="py-20 text-center">
                            <svg className="animate-spin w-6 h-6 text-zinc-600 mx-auto" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="py-24 text-center glass rounded-3xl border border-zinc-800">
                            <div className="text-5xl mb-4">✍️</div>
                            <p className="text-zinc-400 font-semibold text-base mb-2">No articles yet</p>
                            <p className="text-zinc-600 text-sm mb-6">Share your first story with the world.</p>
                            <button onClick={() => setAddOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white cursor-pointer border-0 hover:opacity-90 transition-all"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                                Write Your First Article
                            </button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center text-zinc-600 text-sm">No articles in this category.</div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((post, i) => (
                                <div key={post._id}
                                    className="glass rounded-2xl border border-zinc-800 overflow-hidden flex gap-0 card-hover animate-fade-in-up"
                                    style={{ animationDelay: `${i * 60}ms` }}>

                                    {/* Thumbnail */}
                                    <div className="shrink-0 w-28 sm:w-36 relative overflow-hidden">
                                        <img src={post.image} alt={post.title}
                                            className="w-full h-full object-cover" />
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,transparent,rgba(24,24,27,0.3))' }} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-1 items-center gap-4 px-5 py-4 min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 rounded-full">
                                                    {post.category}
                                                </span>
                                                <span className="text-zinc-700 text-xs">·</span>
                                                <span className="text-zinc-600 text-xs">{post.readTime}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-zinc-100 leading-snug truncate mb-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-zinc-500 truncate">{post.description}</p>
                                            <p className="text-xs text-zinc-700 mt-1.5">{post.date}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="shrink-0 flex items-center gap-2">
                                            <Link href={`/blog/${post._id}`} target="_blank"
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all no-underline"
                                                title="View article">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </Link>
                                            <button onClick={() => setEditPost(post)}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer border-0 bg-transparent"
                                                title="Edit">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => setDeletePost(post)}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer border-0 bg-transparent"
                                                title="Delete">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Modals ── */}
            {addOpen && (
                <AddArticleModal
                    onClose={() => setAddOpen(false)}
                    onSuccess={fetchPosts}
                />
            )}
            {editProfileOpen && (
                <EditProfileModal
                    onClose={() => setEditProfileOpen(false)}
                    onSuccess={() => { }}
                />
            )}
            {editPost && (
                <EditModal
                    post={editPost}
                    onClose={() => setEditPost(null)}
                    onSaved={fetchPosts}
                />
            )}
            {deletePost && (
                <DeleteModal
                    post={deletePost}
                    onClose={() => setDeletePost(null)}
                    onDeleted={fetchPosts}
                />
            )}
        </div>
    );
}
