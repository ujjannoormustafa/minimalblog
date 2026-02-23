'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProfileModal({ onClose, onSuccess }: Props) {
    const { user, refresh } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        avatar: user?.avatar || '',
        bio: user?.bio || '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const overlayRef = useRef<HTMLDivElement>(null);

    // Sync form when user context loads
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                avatar: user.avatar || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setError('Name is required.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) {
                await refresh();
                onSuccess();
                onClose();
            } else {
                setError(json.error || 'Failed to update profile.');
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
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className="relative w-full max-w-lg overflow-y-auto rounded-3xl border border-zinc-800 shadow-2xl shadow-black/80 animate-fade-in-up"
                style={{ background: 'rgba(18,18,22,0.97)' }}
            >
                {/* ── Header ── */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-zinc-800/70"
                    style={{ background: 'rgba(18,18,22,0.97)', backdropFilter: 'blur(12px)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Edit Profile</h2>
                            <p className="text-xs text-zinc-500">Update your public information</p>
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

                    {/* Avatar Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-violet-500/20 overflow-hidden bg-zinc-900 flex items-center justify-center">
                                {form.avatar ? (
                                    <img src={form.avatar} alt="Avatar preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                                ) : (
                                    <span className="text-3xl font-bold text-zinc-700">{form.name ? form.name[0].toUpperCase() : "?"}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Full Name <span className="text-violet-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            required
                        />
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            name="avatar"
                            value={form.avatar}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/…"
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself…"
                            rows={4}
                            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none leading-relaxed"
                        />
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
                            className="px-7 py-2.5 rounded-full text-sm font-semibold text-white transition-all cursor-pointer border-0 flex items-center gap-2 hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
                        >
                            {submitting ? 'Saving…' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
