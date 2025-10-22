import mongoose from 'mongoose';
const { Schema } = mongoose;

const LostItemSchema = new Schema({
    description: String,
    coordinates: { lat: Number, lng: Number },
    address: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: {type: Date, default: Date.now}
});

const LostItem = mongoose.model("LostItem", LostItemSchema);

export { LostItem }