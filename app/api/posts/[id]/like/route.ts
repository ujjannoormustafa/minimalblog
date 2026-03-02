import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Post from '@/lib/models/Post';

export async function POST(
    _req: Request,
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
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        // Initialize likes if it doesn't exist (it should due to schema default)
        if (!post.likes) post.likes = [];

        const likedIndex = post.likes.indexOf(userId);
        if (likedIndex > -1) {
            // Unlike: remove userId
            post.likes.splice(likedIndex, 1);
        } else {
            // Like: add userId
            post.likes.push(userId);
        }

        await post.save();

        return NextResponse.json({
            success: true,
            likes: post.likes,
            likeCount: post.likes.length,
            isLiked: post.likes.includes(userId)
        });
    } catch (error: any) {
        console.error('POST /api/posts/[id]/like error:', error);
        return NextResponse.json({ success: false, error: 'Failed to toggle like' }, { status: 500 });
    }
}
