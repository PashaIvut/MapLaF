import type { MutationResolvers } from './../../types.generated';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../../../config';

function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const parts: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(part);
  }
  
  return parts.join('-');
}

export const register: NonNullable<MutationResolvers['register']> = async (_parent, _arg, _ctx) => {
  const existingUser = await _ctx.User.findOne({ name: _arg.name.trim() });
  
  if (existingUser) {
    throw new Error('Пользователь с таким никнеймом уже существует. Пожалуйста, выберите другой никнейм.');
  }
  
  const recoveryCode = generateRecoveryCode();
  
  const user = new _ctx.User({
    name: _arg.name.trim(),
    password: _arg.password,
    recoveryCode: recoveryCode,
  });
  
  try {
    await user.save();
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.keyPattern?.name) {
        throw new Error('Пользователь с таким никнеймом уже существует. Пожалуйста, выберите другой никнейм.');
      }
      throw new Error('Ошибка при регистрации. Пользователь с такими данными уже существует.');
    }
    throw error;
  }
  
  const token = jwt.sign({ userId: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
  
  return {
    token,
    user,
    recoveryCode: recoveryCode,
  };
};
