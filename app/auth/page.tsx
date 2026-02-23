'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type Mode = 'login' | 'register';

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, refresh } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) router.replace('/dashboard');
    }, [user, router]);

    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'register' && form.password !== form.confirm) {
            setError('Passwords do not match.'); return;
        }
        setLoading(true); setError('');
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login'
                ? { email: form.email, password: form.password }
                : { name: form.name, email: form.email, password: form.password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (json.success) { await refresh(); router.push('/dashboard'); }
            else setError(json.error || 'Something went wrong.');
        } catch {
            setError('Network error — please try again.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (m: Mode) => {
        setMode(m);
        setForm({ name: '', email: '', password: '', confirm: '' });
        setError('');
    };

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40 opacity-40" />
            <div className="orb orb-pink w-80 h-80 -bottom-20 -right-20 opacity-30" />

            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 no-underline mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>M</div>
                        <span className="text-xl font-bold text-zinc-100 tracking-tight">
                            Minimal<span className="font-light text-zinc-500">Blog</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        {mode === 'login' ? 'Sign in to manage your articles.' : 'Join MinimalBlog and start writing.'}
                    </p>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 border border-zinc-800">
                    {/* Tab toggle */}
                    <div className="flex bg-zinc-900 rounded-2xl p-1 mb-7">
                        {(['login', 'register'] as Mode[]).map(m => (
                            <button key={m} onClick={() => switchMode(m)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0
                                    ${mode === m ? 'text-white' : 'text-zinc-500 bg-transparent hover:text-zinc-300'}`}
                                style={mode === m ? { background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' } : {}}>
                                {m === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Full Name</label>
                                <input id="auth-name" name="name" type="text" value={form.name} onChange={handle} required
                                    placeholder="John Doe"
                                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Email</label>
                            <input id="auth-email" name="email" type="email" value={form.email} onChange={handle} required
                                placeholder="you@example.com"
                                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Password</label>
                            <input id="auth-password" name="password" type="password" value={form.password} onChange={handle} required
                                placeholder="••••••••"
                                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                        </div>
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">Confirm Password</label>
                                <input id="auth-confirm" name="confirm" type="password" value={form.confirm} onChange={handle} required
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} id="auth-submit"
                            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white mt-2 flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer border-0 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                            {loading ? (
                                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                            ) : (
                                mode === 'login' ? 'Sign In →' : 'Create Account →'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-600 mt-6">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                            className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer bg-transparent border-0 p-0">
                            {mode === 'login' ? 'Register here' : 'Sign in'}
                        </button>
                    </p>
                </div>

                <p className="text-center text-xs text-zinc-700 mt-6">
                    <Link href="/" className="text-zinc-600 hover:text-violet-400 transition-colors no-underline">← Back to blog</Link>
                </p>
            </div>
        </main>
    );
}
