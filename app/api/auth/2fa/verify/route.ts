// app/api/auth/2fa/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import speakeasy from 'speakeasy';
import { getUserIdFromToken } from '@/lib/authUtils';

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { token } = await req.json();
    await dbConnect();
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ message: '2FA not set up for this user.' }, { status: 400 });
    }
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1,
    });

    if (verified) {
      user.isTwoFactorEnabled = true;
      await user.save();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 400 });
    }
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}