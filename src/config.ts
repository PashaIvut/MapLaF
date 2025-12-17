import { config } from 'dotenv';

config();

function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

export const NODE_ENV = getEnv('NODE_ENV') || 'development';
export const PORT = Number(getEnv('PORT')) || 4000;
export const MONGODB_URI = getEnv('MONGODB_URI') || (NODE_ENV === 'production' ? '' : 'mongodb://localhost:27018/lost-and-found');
export const JWT_SECRET = getEnv('JWT_SECRET') || 'your-secret-key-change-in-production';
export const FRONTEND_URL = getEnv('FRONTEND_URL') || `http://localhost:${PORT}`;
