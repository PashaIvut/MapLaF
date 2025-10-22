import mongoose, { Schema, Document } from 'mongoose';

interface ILostItem extends Document {
    description: string;
    coordinates: { lat: number; lng: number };
    address: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
}

const LostItemSchema = new Schema<ILostItem>({
    description: {
        type: String, 
        required: true
    },
    coordinates: { 
        lat: Number, 
        lng: Number 
    },
    address: String,
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    createdAt: {
        type: Date, 
        
        default: Date.now}
});

const LostItem = mongoose.model<ILostItem>("LostItem", LostItemSchema);

export { LostItem }
export type { ILostItem }