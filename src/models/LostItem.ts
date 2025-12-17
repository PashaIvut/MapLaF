import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface ILostItem extends Document {
  title: string;
  description: string;
  location?: ILocation;
  lostBy: mongoose.Types.ObjectId;
  lostAt: Date;
  isFound: boolean;
  foundItem?: mongoose.Types.ObjectId;
  phone?: string;
  photos: string[];
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
});

const LostItemSchema = new Schema<ILostItem>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: LocationSchema,
  },
  lostBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lostAt: {
    type: Date,
    default: Date.now,
  },
  isFound: {
    type: Boolean,
    default: false,
  },
  foundItem: {
    type: Schema.Types.ObjectId,
    ref: 'FoundItem',
  },
  phone: {
    type: String,
    trim: true,
  },
  photos: {
    type: [String],
    default: [],
  },
});

export const LostItem = mongoose.model<ILostItem>('LostItem', LostItemSchema);



