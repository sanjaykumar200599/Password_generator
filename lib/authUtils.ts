import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    return (decoded as { userId: string }).userId;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}