'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from './data';
import Header from './components/Header';
import BlogCard from './components/BlogCard';

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

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setActiveCategory(categoryParam); }, [categoryParam]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/posts');
        const json = await res.json();
        if (json.success) setPosts(json.data);
        else setError('Could not load posts.');
      } catch {
        setError('Network error — please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = posts.find(p => p.featured);
  const filtered = activeCategory === 'All'
    ? posts.filter(p => !p.featured)
    : posts.filter(p => p.category === activeCategory);

  // Map MongoDB _id → id for BlogCard compatibility
  const toCardPost = (p: Post) => ({ ...p, id: p._id });

  return (
    <main className="min-h-screen bg-zinc-950">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-48 -left-48 opacity-60" />
        <div className="orb orb-pink   w-96   h-96   -top-24 -right-24 opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#8b5cf6,#ec4899)' }} />
              <span className="text-xs font-semibold tracking-widest uppercase text-violet-400">
                Welcome to MinimalBlog
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter text-zinc-100 mb-5">
              Stories that{' '}
              <span className="gradient-text">inspire</span>
              <br />and inform.
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-10 font-light max-w-lg">
              Thoughtful writing on technology, design, travel, and the art of living well. No noise — just signal.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#posts"
                className="px-6 py-3 rounded-full text-sm font-semibold text-white no-underline hover:opacity-90 hover:-translate-y-px transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                Explore Stories
              </a>
              <a href="/about"
                className="px-6 py-3 rounded-full text-sm font-medium text-zinc-400 border border-zinc-700 no-underline hover:border-violet-500/50 hover:text-zinc-100 transition-all duration-200">
                About Us
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 mt-16 animate-fade-in-up delay-200">
            {[
              { value: loading ? '—' : `${posts.length}+`, label: 'Articles' },
              { value: '4', label: 'Categories' },
              { value: '5K+', label: 'Readers' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-zinc-100 tracking-tighter">{stat.value}</div>
                <div className="text-xs text-zinc-600 font-medium mt-0.5 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Loading / Error states ── */}
      {loading && (
        <div className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <div className="inline-flex items-center gap-3 text-zinc-500 text-sm">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading posts
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
            <p className="text-zinc-600 text-xs mt-2">
              Make sure you've seeded the DB by visiting{' '}
              <a href="/api/seed" className="text-violet-400 underline">/api/seed</a>
            </p>
          </div>
        </div>
      )}

      {/* ── Featured Post ── */}
      {!loading && !error && featuredPost && activeCategory === 'All' && (
        <section className="max-w-5xl mx-auto px-6 pb-20 animate-fade-in-up delay-300">
          <div className="flex items-center gap-4 mb-7">
            <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-600 whitespace-nowrap">
              Featured Story
            </h2>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#27272a,transparent)' }} />
          </div>
          <BlogCard post={toCardPost(featuredPost)} featured />
        </section>
      )}

      {/* ── Posts Grid ── */}
      {!loading && !error && (
        <section id="posts" className="max-w-5xl mx-auto px-6 pb-32">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-600">
              {activeCategory === 'All' ? 'Latest Stories' : activeCategory}
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border cursor-pointer transition-all duration-200
                                        ${activeCategory === cat
                      ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                      : 'border-zinc-700 text-zinc-500 bg-transparent hover:border-violet-500/40 hover:text-violet-400'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <div key={post._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <BlogCard post={toCardPost(post)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-zinc-600 text-base">No stories in this category yet.</p>
            </div>
          )}
        </section>
      )}

      {/* ── Newsletter ── */}
      <section className="border-y border-zinc-800/60 py-20 px-6"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(236,72,153,0.05))' }}>
        <div className="max-w-md mx-auto text-center">
          {/* <div className="text-4xl mb-4">✉️</div> */}
          <h2 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">Stay in the loop</h2>
          <p className="text-zinc-400 text-sm mb-7 leading-relaxed">
            Get the best stories delivered to your inbox. No spam, ever.
          </p>
          <form className="flex gap-2"
            onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing! 🎉'); }}>
            <input type="email" placeholder="your@email.com" required
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors" />
            <button type="submit"
              className="px-5 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer border-0"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/50 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>M</div>
            <span className="text-zinc-600 text-sm">© 2026 MinimalBlog. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }].map(l => (
              <a key={l.label} href={l.href}
                className="text-zinc-600 text-xs no-underline hover:text-violet-400 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-600">Loading…</div>}>
      <HomeContent />
    </Suspense>
  );
}
