import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface CardInterface extends mongoose.Document {
  id: string,
  localId: string,
  name: string,
  images: {
    high: string,
    low: string,
  },
  category: string,
  illustrator?: string,
  rarity?: string,
  setInfo: {
    id: string,
    name: string,
  },
  created?: Date,
  updated?: Date,
};

const CardSchema = new mongoose.Schema<CardInterface>({
  id: {
    type: String,
    required: true,
  },
  localId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: Schema.Types.Mixed,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  illustrator: {
    type: String,
    required: false,
  },
  rarity: {
    type: String,
    required: false,
  },
  setInfo: {
    type: Schema.Types.Mixed,
    required: true,
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

export default mongoose.models.Card || mongoose.model<CardInterface>("Card", CardSchema);
