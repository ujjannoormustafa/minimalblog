import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Post {
    _id?: string;
    id?: string;
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

interface BlogCardProps {
    post: Post;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [likes, setLikes] = useState<string[]>(post.likes || []);
    const [isLiking, setIsLiking] = useState(false);

    const isLiked = user && likes.includes(user.id);

    // Calculate average rating
    const postRatings = post.ratings || [];
    const avgRating = postRatings.length > 0
        ? (postRatings.reduce((acc, r) => acc + r.rating, 0) / postRatings.length).toFixed(1)
        : "0.0";

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/auth');
            return;
        }

        if (isLiking) return;

        setIsLiking(true);
        try {
            const res = await fetch(`/api/posts/${post._id || post.id}/like`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setLikes(data.likes);
            }
        } catch (err) {
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
        }
    };

    if (featured) {
        return (
            <Link href={`/blog/${post._id || post.id}`} className="block no-underline group">
                <div className="relative rounded-3xl overflow-hidden border border-zinc-800 card-hover" style={{ height: 460 }}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.5) 50%, transparent 100%)' }} />

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10">
                                {post.category}
                            </span>
                            <span className="text-zinc-500 text-xs">⭑ Featured</span>
                            <div className="flex items-center gap-1 ml-auto text-amber-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                                <span className="text-xs font-bold text-zinc-300">{avgRating}</span>
                                <span className="text-zinc-600 font-normal ml-0.5">({postRatings.length})</span>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 leading-tight mb-3 tracking-tight">
                            {post.title}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mb-6">
                            {post.description}
                        </p>

                        <div className="flex items-center gap-3">
                            <img src={post.authorAvatar} alt={post.author}
                                className="w-9 h-9 rounded-full object-cover border-2 border-violet-500/40" />
                            <div>
                                <div className="text-zinc-100 text-sm font-semibold">{post.author}</div>
                                <div className="text-zinc-600 text-xs">{post.date} · {post.readTime}</div>
                            </div>
                            <div className="ml-auto flex items-center b-2 gap-4">
                                <button
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${isLiked
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                        : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill={isLiked ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.77-8.77 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    {likes.length}
                                </button>
                                <Link
                                    href={`/blog/${post._id || post.id}#comments`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 no-underline"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    </svg>
                                    {post.comments?.length || 0}
                                </Link>
                                <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold group-hover:gap-3 transition-all">
                                    Read Story
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post._id || post.id}`} className="block no-underline h-full group">
            <div className="glass card-hover rounded-2xl overflow-hidden h-full flex flex-col">

                {/* Image */}
                <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '16/9' }}>
                    <img src={post.image} alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(24,24,27,0.75) 0%, transparent 55%)' }} />
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10">
                            {post.category}
                        </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800/50 text-amber-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                        <span className="text-[10px] font-bold text-zinc-200">{avgRating}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-zinc-600 text-xs font-medium">{post.date}</span>
                        <span className="text-zinc-700 text-xs">·</span>
                        <span className="text-zinc-600 text-xs font-medium">{post.readTime}</span>
                    </div>

                    <h2 className="text-base font-bold leading-snug text-zinc-100 mb-2 tracking-tight group-hover:text-violet-400 transition-colors duration-200">
                        {post.title}
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-5">
                        {post.description}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${isLiked
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30'
                                }`}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.77-8.77 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {isLiked ? 'Liked' : 'Like'} · {likes.length}
                        </button>
                        <Link
                            href={`/blog/${post._id || post.id}#comments`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30 no-underline"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            Comments · {post.comments?.length || 0}
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/60 mt-auto">
                        <img src={post.authorAvatar} alt={post.author}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-700" />
                        <span className="text-zinc-500 text-xs font-medium flex-1">{post.author}</span>
                        <span className="text-violet-400 text-xs font-semibold">Read →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
