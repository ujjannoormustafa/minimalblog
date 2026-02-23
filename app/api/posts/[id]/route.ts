import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/lib/models/Post';

// GET /api/posts/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const post = await Post.findById(id).lean();

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error('GET /api/posts/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
    }
}

// DELETE /api/posts/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { cookies } = await import('next/headers');
        const { verifyToken } = await import('@/lib/jwt');
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        // Check ownership
        if (post.userId && post.userId !== payload.userId) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await Post.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error('DELETE /api/posts/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
    }
}

// PATCH /api/posts/[id]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { cookies } = await import('next/headers');
        const { verifyToken } = await import('@/lib/jwt');
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        // Check ownership
        if (post.userId && post.userId !== payload.userId) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const updated = await Post.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('PATCH /api/posts/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
    }
}
