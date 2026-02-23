import Header from '@/components/Header';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About — MinimalBlog',
    description: 'Learn about MinimalBlog — thoughtful writing on technology, design, travel, and lifestyle.',
};

const TEAM = [
    {
        name: 'Alex Morgan', role: 'Technology & Remote Work',
        bio: 'Covering the intersection of technology, productivity, and human potential.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'Sarah Chen', role: 'Lifestyle & Habits',
        bio: 'Exploring minimalism, mindful living, and the habits that help us thrive.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'Marco Ricci', role: 'Travel & Culture',
        bio: 'Discovering hidden corners of the world and the stories that live there.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'Priya Sharma', role: 'Design & Creativity',
        bio: 'Making the case for beautiful, intentional design in everything we create.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
];

const MISSION = [
    { icon: '✍️', title: 'Quality Over Quantity', desc: 'Every post is carefully researched and written to give you real value — not filler content.' },
    { icon: '🎯', title: 'Signal, Not Noise', desc: 'No clickbait, no shallow takes. Just thoughtful, substantive ideas that respect your time.' },
    { icon: '🌍', title: 'Diverse Perspectives', desc: 'Our writers come from different backgrounds, disciplines, and corners of the world.' },
    { icon: '♻️', title: 'Evergreen Content', desc: "We focus on ideas that remain relevant long after they're published." },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-950">
            <Header />

            {/* ── Hero ── */}
            <section className="relative pt-40 pb-16 overflow-hidden">
                <div className="orb orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-50" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-violet-500/20 bg-violet-500/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-violet-400">Our Story</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-zinc-100 mb-5">
                        Writing that{' '}
                        <span className="gradient-text">matters</span>
                    </h1>

                    <p className="text-lg text-zinc-400 leading-relaxed font-light max-w-xl mx-auto">
                        MinimalBlog is a home for stories that cut through the noise. We believe in depth over volume, quality over velocity, and ideas that stick with you.
                    </p>
                </div>
            </section>

            {/* ── Mission Cards ── */}
            <section className="max-w-5xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {MISSION.map((item, i) => (
                        <div key={item.title}
                            className="glass card-hover rounded-2xl p-7 animate-fade-in-up"
                            style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h3 className="text-sm font-bold text-zinc-100 mb-2">{item.title}</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Team ── */}
            <section className="max-w-5xl mx-auto px-6 pb-28">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-600 whitespace-nowrap">
                        Meet the Writers
                    </h2>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#27272a,transparent)' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TEAM.map((member, i) => (
                        <div key={member.name}
                            className="glass card-hover rounded-2xl p-7 text-center animate-fade-in-up"
                            style={{ animationDelay: `${i * 80}ms` }}>
                            <img src={member.avatar} alt={member.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-violet-500/30" />
                            <h3 className="text-sm font-bold text-zinc-100 mb-1">{member.name}</h3>
                            <div className="text-[11px] font-semibold text-violet-400 tracking-wide mb-3">{member.role}</div>
                            <p className="text-xs text-zinc-500 leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="border-y border-zinc-800/60 py-20 px-6 text-center"
                style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(236,72,153,0.05))' }}>
                <h2 className="text-3xl font-bold text-zinc-100 mb-3 tracking-tight">Ready to explore?</h2>
                <p className="text-zinc-400 text-sm mb-8">Dive into our stories across tech, design, travel, and lifestyle.</p>
                <Link href="/"
                    className="px-8 py-3 rounded-full text-sm font-semibold text-white no-underline hover:opacity-90 hover:-translate-y-px transition-all duration-200 inline-block"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                    Browse All Stories
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800/40 py-10 text-center">
                <p className="text-zinc-600 text-xs">© 2026 MinimalBlog. All rights reserved.</p>
            </footer>
        </main>
    );
}
