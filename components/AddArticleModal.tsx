'use client';

import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../app/data';
import { useAuth } from '@/context/AuthContext';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

const CONTENT_CATEGORIES = CATEGORIES.filter(c => c !== 'All');

export default function AddArticleModal({ onClose, onSuccess }: Props) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        content: '',
        image: '',
        category: CONTENT_CATEGORIES[0],
        description: '',
        author: user?.name || '',
        authorAvatar: user?.avatar || '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Sync author info when user context loads
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                author: prev.author || user.name || '',
                authorAvatar: prev.authorAvatar || user.avatar || ''
            }));
        }
    }, [user]);

    // Update the local payload generation later to be safe
    const [error, setError] = useState('');
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim() || !form.image.trim()) {
            setError('Title, blog content, and image URL are required.');
            return;
        }

        setSubmitting(true);
        setError('');

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const wordCount = form.content.trim().split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        const payload = {
            title: form.title.trim(),
            description: form.description.trim() || form.content.trim().slice(0, 120) + '…',
            content: form.content.trim(),
            image: form.image.trim(),
            category: form.category,
            date: dateStr,
            readTime,
            author: form.author.trim() || user?.name || 'Anonymous',
            authorAvatar: form.authorAvatar.trim() || user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            featured: false,
            userId: user?.id || null,
        };

        console.log('Publishing article with payload:', payload);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            console.log('Server response:', json);
            if (json.success) {
                onSuccess();
                onClose();
            } else {
                setError(json.error || 'Failed to create article. Please try again.');
            }
        } catch {
            setError('Network error — please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 shadow-2xl shadow-black/80 animate-fade-in-up"
                style={{ background: 'rgba(18,18,22,0.97)' }}
            >
                {/* ── Header ── */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-zinc-800/70"
                    style={{ background: 'rgba(18,18,22,0.97)', backdropFilter: 'blur(12px)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">New Article</h2>
                            <p className="text-xs text-zinc-500">Share your story with the world</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer border-0 bg-transparent"
                        aria-label="Close modal"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Title <span className="text-violet-400">*</span>
                        </label>
                        <input
                            id="article-title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Write a compelling title…"
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            maxLength={120}
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Image URL <span className="text-violet-400">*</span>
                        </label>
                        <input
                            id="article-image"
                            type="url"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/…"
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                        />
                        {/* Image preview */}
                        {form.image && (
                            <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800" style={{ height: 140 }}>
                                <img
                                    src={form.image}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Category
                        </label>
                        <select
                            id="article-category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all cursor-pointer appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                        >
                            {CONTENT_CATEGORIES.map(cat => (
                                <option key={cat} value={cat} style={{ background: '#18181b' }}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Short description (optional) */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Short Description <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional — auto-generated if empty)</span>
                        </label>
                        <input
                            id="article-description"
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="A brief teaser for your story…"
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            maxLength={200}
                        />
                    </div>

                    {/* Blog content */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Blog Content <span className="text-violet-400">*</span>
                        </label>
                        <textarea
                            id="article-content"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Write your full article here… (read time is calculated automatically)"
                            rows={9}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none leading-relaxed"
                        />
                        <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-zinc-600">
                                {form.content.trim() ? `~${Math.max(1, Math.ceil(form.content.trim().split(/\s+/).length / 200))} min read · ${form.content.trim().split(/\s+/).filter(Boolean).length} words` : 'Start writing…'}
                            </span>
                        </div>
                    </div>

                    {/* Author row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                                Author Name <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
                            </label>
                            <input
                                id="article-author"
                                type="text"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                                Avatar URL <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
                            </label>
                            <input
                                id="article-avatar"
                                type="url"
                                name="authorAvatar"
                                value={form.authorAvatar}
                                onChange={handleChange}
                                placeholder="https://…"
                                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 pb-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full text-sm font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-200 transition-all cursor-pointer bg-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            id="article-submit"
                            className="px-7 py-2.5 rounded-full text-sm font-semibold text-white transition-all cursor-pointer border-0 flex items-center gap-2 hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Publishing…
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    Publish Article
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
