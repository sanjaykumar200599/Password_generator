// app/api/vault/import/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import VaultItem from '@/lib/models/VaultItem';
import { getUserIdFromToken } from '@/lib/authUtils';

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array of items.' }, { status: 400 });
    }

    // Assign the current user's ID to all imported items
    const itemsToInsert = items.map(item => ({
      ...item,
      userId,
      _id: undefined, // Let MongoDB generate a new ID
      createdAt: undefined,
      updatedAt: undefined,
    }));

    if (itemsToInsert.length > 0) {
      await VaultItem.insertMany(itemsToInsert);
    }

    return NextResponse.json({ message: `${itemsToInsert.length} items imported successfully.` }, { status: 201 });
  } catch (error) {
    console.error("Error importing vault items:", error);
    return NextResponse.json({ message: "Failed to import items" }, { status: 500 });
  }
}