import mongoose, { Schema, Document } from 'mongoose';

interface IFoundItem extends Document {
    description: string;
    coordinates: { lat: number; lng: number };
    address: string;
    author: mongoose.Types.ObjectId;
    date: Date;
}

const FoundItemSchema = new Schema<IFoundItem>({
    description: {
        type: String, 
        required: true
    },
    coordinates: { 
        lat: Number, 
        lng: Number
    },
    address: {
        type: String, 
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
});

const FoundItem = mongoose.model<IFoundItem>("FoundItem", FoundItemSchema);

export { FoundItem }
export type { IFoundItem }