// app/api/vault/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import VaultItem from '@/lib/models/VaultItem';
import { getUserIdFromToken } from '@/lib/authUtils';

// PUT (Update) an item by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const item = await VaultItem.findById(params.id);

    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }
    // Verify ownership
    if (item.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedItem = await VaultItem.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ message: "Failed to update item" }, { status: 500 });
  }
}

// DELETE an item by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const item = await VaultItem.findById(params.id);

    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }
    // Verify ownership
    if (item.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await VaultItem.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ message: "Failed to delete item" }, { status: 500 });
  }
}