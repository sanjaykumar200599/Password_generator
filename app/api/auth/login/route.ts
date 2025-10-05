// app/api/auth/login/route.ts

import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { speakeasy } from 'speakeasy';

export async function POST(req: Request) {
  await dbConnect();
  const { email, password, token: twoFactorToken } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }

  if (user.isTwoFactorEnabled) {
    if (!twoFactorToken) {
      // 2FA is enabled, but no token was provided. Prompt the user for it.
      return NextResponse.json({ twoFactorRequired: true });
    }

    // A 2FA token was provided, so verify it.
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorToken,
    });

    if (!verified) {
      return NextResponse.json({ message: 'Invalid 2FA token.' }, { status: 401 });
    }
  }

  // If 2FA is disabled or successfully verified, issue the JWT
  const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return NextResponse.json({ token: authToken });
}