import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Post from '@/lib/models/Post';

// GET /api/posts  — fetch all posts (optional ?category=X filter)
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const filter = category && category !== 'All' ? { category } : {};
        const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: posts });
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST /api/posts — create a new post
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        const payload = token ? verifyToken(token) : null;

        await connectDB();
        const body = await request.json();

        // Debug logs
        console.log('--- NEW POST REQUEST ---');
        console.log('Body userId:', body.userId);
        console.log('Payload userId:', payload?.userId);

        // Calculate final userId with multiple fallbacks
        let finalUserId = (payload && (payload as any).userId) || body.userId;

        // If still null, try 'id' field from payload just in case
        if (!finalUserId && payload) {
            finalUserId = (payload as any).id;
        }

        console.log('Final userId decided:', finalUserId);

        const postData = {
            ...body,
            userId: finalUserId || null
        };

        const post = await Post.create(postData);
        console.log('Successfully saved post. ID:', post._id, 'userId:', post.userId);

        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create post' }, { status: 500 });
    }
}
