import mongoose, { Schema, Document } from 'mongoose';


interface IUser extends Document {
    username: string;
    password: string;
    createdAt: Date;
}

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        trim: true
    },
    password: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

export { User }
export type { IUser }

