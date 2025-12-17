import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface IFoundItem extends Document {
  title: string;
  description?: string;
  location?: ILocation;
  foundBy: mongoose.Types.ObjectId;
  foundAt: Date;
  isClaimed: boolean;
  claimedBy?: mongoose.Types.ObjectId;
  claimedAt?: Date;
  phone?: string;
  photos: string[];
  isReturned: boolean;
  returnedAt?: Date;
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
});

const FoundItemSchema = new Schema<IFoundItem>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: LocationSchema,
  },
  phone: {
    type: String,
    trim: true,
  },
  photos: {
    type: [String],
    default: [],
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  returnedAt: {
    type: Date,
  },
  foundBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foundAt: {
    type: Date,
    default: Date.now,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  claimedAt: {
    type: Date,
  },
});

export const FoundItem = mongoose.model<IFoundItem>('FoundItem', FoundItemSchema);



