import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        if (!email?.trim() || !password?.trim()) {
            return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
        }

        const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });

        const res = NextResponse.json({
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar },
        });

        res.cookies.set('mb_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return res;
    } catch (err) {
        console.error('POST /api/auth/login error:', err);
        return NextResponse.json({ success: false, error: 'Login failed. Please try again.' }, { status: 500 });
    }
}
