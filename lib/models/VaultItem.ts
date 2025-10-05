// lib/models/VaultItem.ts

import mongoose, { Schema } from 'mongoose';

const VaultItemSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // All fields below are stored as encrypted strings
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  tags: { type: [String], default: [] }, // For tags/folders 
}, { timestamps: true });

export default mongoose.models.VaultItem || mongoose.model('VaultItem', VaultItemSchema);