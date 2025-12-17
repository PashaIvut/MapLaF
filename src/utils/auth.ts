import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import type { Context } from '../context';

export async function getCurrentUser(context: Context, token?: string): Promise<any | null> {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await context.User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(context: Context, token?: string): Promise<any> {
  const user = await getCurrentUser(context, token);
  
  if (!user) {
    throw new Error('Необходима авторизация');
  }
  
  if (user.role !== 'admin') {
    throw new Error('Доступ запрещен. Требуются права администратора');
  }
  
  return user;
}

