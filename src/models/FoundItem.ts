import mongoose from 'mongoose';
const { Schema } = mongoose;

const FoundItemSchema = new Schema({
    description: String,
    coordinates: { lat: Number, lng: Number},
    address: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
});

const FoundItem = mongoose.model("FoundItem", FoundItemSchema);

export { FoundItem }