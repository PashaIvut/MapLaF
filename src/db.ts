import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from './config';

export const connectDB = async () => {
  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    const errorMsg = 'MONGODB_URI не установлен! Установите переменную окружения MONGODB_URI.';
    if (NODE_ENV === 'production') {
      process.exit(1);
    }
    throw new Error(errorMsg);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection.db;
    if (db) {
      try {
        const collections = await db.listCollections({ name: 'users' }).toArray();
        
        if (collections.length > 0) {
          const usersCollection = db.collection('users');
          const indexes = await usersCollection.indexes();
          const nameIndex = indexes.find((idx: any) => idx.name === 'name_1');
          
          if (nameIndex) {
            await usersCollection.dropIndex('name_1');
          }
        }
      } catch (collectionError: any) {
        if (collectionError.code !== 26 && collectionError.codeName !== 'NamespaceNotFound') {
          throw collectionError;
        }
      }
    }
  } catch (error) {
    process.exit(1);
  }
};
