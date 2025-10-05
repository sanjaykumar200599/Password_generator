// app/api/auth/login/route.ts

import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password, token: twoFactorToken } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    if (user.isTwoFactorEnabled) {
      if (!twoFactorToken) {
        return NextResponse.json({ twoFactorRequired: true });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 1,
      });

      if (!verified) {
        return NextResponse.json({ message: 'Invalid 2FA token.' }, { status: 401 });
      }
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token: authToken });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}