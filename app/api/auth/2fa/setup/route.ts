// app/api/auth/2fa/setup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { getUserIdFromToken } from '@/lib/authUtils';

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const secret = speakeasy.generateSecret({ name: `SecureVault (${user.email})` });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({ qrCodeUrl });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}