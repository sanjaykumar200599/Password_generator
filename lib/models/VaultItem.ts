import mongoose, { Schema } from 'mongoose';

const VaultItemSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.VaultItem || mongoose.model('VaultItem', VaultItemSchema);