import type { MutationResolvers } from './../../types.generated';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config';

export const login: NonNullable<MutationResolvers['login']> = async (_parent, _arg, _ctx) => {
  const user = await _ctx.User.findOne({ name: _arg.name.trim() });
  
  if (!user) {
    throw new Error('Неверный никнейм или пароль');
  }
  
  const isPasswordValid = await user.comparePassword(_arg.password);
  
  if (!isPasswordValid) {
    throw new Error('Неверный никнейм или пароль');
  }
  
  const token = jwt.sign({ userId: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
  
  return {
    token,
    user,
    recoveryCode: '', 
  };
};

