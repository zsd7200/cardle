import mongoose from 'mongoose';

export interface PokemonInterface extends mongoose.Document {
  name: string,
  api_url: string,
  created?: Date,
  updated?: Date,
};

const PokemonSchema = new mongoose.Schema<PokemonInterface>({
  name: {
    type: String,
    required: true,
  },
  api_url: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

export default mongoose.models.Pokemon || mongoose.model<PokemonInterface>("Pokemon", PokemonSchema);