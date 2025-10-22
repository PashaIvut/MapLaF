import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model('User', UserSchema);

export { User }

