import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}).select('-password').lean();

        return NextResponse.json({
            success: true,
            users: users.map((u: any) => ({
                id: u._id.toString(),
                name: u.name,
                email: u.email,
                avatar: u.avatar,
                bio: u.bio,
                role: 'Writer' // Default role for display
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, users: [] }, { status: 500 });
    }
}
