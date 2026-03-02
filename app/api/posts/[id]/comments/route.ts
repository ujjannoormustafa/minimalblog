import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (payload as any).userId || (payload as any).id;
        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID not found' }, { status: 400 });
        }

        await connectDB();

        const { id } = await params;
        const [post, user] = await Promise.all([
            Post.findById(id),
            User.findById(userId).lean()
        ]);

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const { text } = await request.json();
        if (!text || text.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
        }

        // Add the comment
        const newComment = {
            userId,
            userName: (user as any).name || 'User',
            userAvatar: (user as any).avatar || '',
            text,
            createdAt: new Date(),
        };

        // Initialize comments if it doesn't exist
        if (!post.comments) post.comments = [];

        post.comments.push(newComment);
        await post.save();

        return NextResponse.json({
            success: true,
            comments: post.comments,
        });
    } catch (error: any) {
        console.error('POST /api/posts/[id]/comments error:', error);
        return NextResponse.json({ success: false, error: 'Failed to add comment' }, { status: 500 });
    }
}
