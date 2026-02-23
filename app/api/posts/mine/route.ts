import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        const payload = token ? verifyToken(token) : null;

        // Use a unique variable name to avoid any scope collision
        const targetUserId = (payload as any)?.userId || (payload as any)?.id;

        if (!payload || !targetUserId) {
            console.log('Unauthorized in /mine: missing identifier');
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const isValidObjectId = mongoose.Types.ObjectId.isValid(targetUserId);

        const query: any = {
            $or: [
                { userId: targetUserId },
                ...(isValidObjectId ? [{ userId: new mongoose.Types.ObjectId(targetUserId) }] : [])
            ]
        };

        const posts = await Post.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: posts });
    } catch (error: any) {
        console.error('GET /api/posts/mine error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch post' }, { status: 500 });
    }
}
