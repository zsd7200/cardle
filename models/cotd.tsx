import mongoose from 'mongoose';

export interface COTDInterface extends mongoose.Document {
  card_id: string,
  set_id: string,
  date: string,
};

const COTDSchema = new mongoose.Schema<COTDInterface>({
  card_id: {
    type: String,
    required: true,
  },
  set_id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.models.COTD || mongoose.model<COTDInterface>("COTD", COTDSchema);
