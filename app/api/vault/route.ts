// app/api/vault/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import VaultItem from '@/lib/models/VaultItem';
import { getUserIdFromToken } from '@/lib/authUtils';

// GET all items for a user
export async function GET(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const items = await VaultItem.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(items);
}

// POST a new item for a user
export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const newItem = new VaultItem({ ...body, userId });
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating vault item:", error);
    return NextResponse.json({ message: "Failed to create item" }, { status: 500 });
  }
}