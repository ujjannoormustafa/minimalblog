import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('mb_token')?.value;
        if (!token) return NextResponse.json({ success: false, user: null });

        const payload = verifyToken(token);
        if (!payload) return NextResponse.json({ success: false, user: null });

        await connectDB();
        const user = await User.findById(payload.userId).select('-password').lean();
        if (!user) return NextResponse.json({ success: false, user: null });

        return NextResponse.json({
            success: true,
            user: { id: (user as any)._id.toString(), name: (user as any).name, email: (user as any).email, avatar: (user as any).avatar, bio: (user as any).bio },
        });
    } catch {
        return NextResponse.json({ success: false, user: null });
    }
}
