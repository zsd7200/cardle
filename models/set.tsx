import mongoose from 'mongoose';

export interface SetInterface extends mongoose.Document {
  set_id: string,
  name: string,
  total: number,
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
  total: {
    type: Number,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

export default mongoose.models.Set || mongoose.model<SetInterface>("Set", SetSchema);