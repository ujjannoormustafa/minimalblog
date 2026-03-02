import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Post from '@/lib/models/Post';

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

        const { rating } = await request.json();
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: 'Invalid rating. Must be between 1 and 5.' }, { status: 400 });
        }

        await connectDB();
        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        // Initialize ratings if it doesn't exist
        if (!post.ratings) post.ratings = [];

        // Check if the user already rated
        const existingRatingIndex = post.ratings.findIndex((r: any) => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update existing rating
            post.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            post.ratings.push({ userId, rating });
        }

        await post.save();

        // Calculate average for response
        const totalRating = post.ratings.reduce((acc: number, r: any) => acc + r.rating, 0);
        const averageRating = post.ratings.length > 0 ? (totalRating / post.ratings.length).toFixed(1) : "0";

        return NextResponse.json({
            success: true,
            ratings: post.ratings,
            ratingCount: post.ratings.length,
            averageRating: Number(averageRating)
        });
    } catch (error: any) {
        console.error('POST /api/posts/[id]/rating error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit rating' }, { status: 500 });
    }
}
