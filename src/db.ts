import mongoose from 'mongoose';
import { config } from './config';
import './models/User';
import './models/LostItem';
import './models/FoundItem';

async function connectDb() {
    await mongoose.connect(config.mongoUrl);
    mongoose.connection.on('error', (err) => console.error('[mongo]', err))
    mongoose.connection.once('connected', () => console.log('[mongo] connected'))
}

export { connectDb }