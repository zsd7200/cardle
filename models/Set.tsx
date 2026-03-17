import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { RawCardBriefData } from '@/components/util/tcg/CardUtilities';

export interface SetInterface extends mongoose.Document {
  set_id: string,
  name: string,
  cardCount: {
    total: number,
    official: number,
  },
  data: Array<RawCardBriefData>,
  created?: Date,
  updated?: Date,
};

const SetSchema = new mongoose.Schema<SetInterface>({
  set_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cardCount: {
    type: Schema.Types.Mixed,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

export default mongoose.models.Set || mongoose.model<SetInterface>("Set", SetSchema);
