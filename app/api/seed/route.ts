import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { POSTS } from '@/app/data';

// GET /api/seed — seeds the DB with static posts (run once)
export async function GET() {
    try {
        await connectDB();

        // Clear existing posts
        await Post.deleteMany({});

        // Insert all static posts (strip the `id` field, let MongoDB create _id)
        const postsToInsert = POSTS.map(({ id: _id, ...rest }) => rest);
        const inserted = await Post.insertMany(postsToInsert);

        return NextResponse.json({
            success: true,
            message: `Seeded ${inserted.length} posts into MongoDB.`,
            data: inserted,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
