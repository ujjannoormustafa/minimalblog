import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed });

        const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });

        const res = NextResponse.json({
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar },
        }, { status: 201 });

        res.cookies.set('mb_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return res;
    } catch (err) {
        console.error('POST /api/auth/register error:', err);
        return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
