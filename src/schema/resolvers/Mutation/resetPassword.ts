import type { MutationResolvers } from './../../types.generated';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config';

export const resetPassword: NonNullable<MutationResolvers['resetPassword']> = async (_parent, _arg, _ctx) => {
  if (_arg.newPassword.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов');
  }

  let decoded: any;
  try {
    decoded = jwt.verify(_arg.token, JWT_SECRET);
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Неверный тип токена');
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Токен сброса пароля истек. Запросите новый.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Неверный токен сброса пароля');
    }
    throw new Error('Неверный или истекший токен сброса пароля');
  }

  const user = await _ctx.User.findById(decoded.userId);

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  if (decoded.name && decoded.name !== user.name) {
    throw new Error('Неверный токен сброса пароля');
  }

  user.password = _arg.newPassword;
  await user.save();

  return true;
};
