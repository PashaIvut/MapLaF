import type { MutationResolvers } from './../../types.generated';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config';

export const requestPasswordReset: NonNullable<MutationResolvers['requestPasswordReset']> = async (_parent, _arg, _ctx) => {
  const name = _arg.name?.trim();
  const recoveryCode = _arg.recoveryCode?.trim().toUpperCase();
  
  if (!name) {
    throw new Error('Имя пользователя обязательно');
  }

  if (!recoveryCode) {
    throw new Error('Код восстановления обязателен');
  }

  try {
    const user = await _ctx.User.findOne({ name });

  if (!user) {
      throw new Error('Пользователь с таким никнеймом не найден');
    }

    if (!user.recoveryCode) {
      throw new Error('У этого пользователя нет кода восстановления. Пожалуйста, зарегистрируйтесь заново.');
  }

    const normalizedUserCode = user.recoveryCode.trim().toUpperCase().replace(/\s/g, '');
    const normalizedInputCode = recoveryCode.replace(/\s/g, '');

    if (normalizedUserCode !== normalizedInputCode) {
      throw new Error('Неверный код восстановления');
    }

    const resetToken = jwt.sign(
      { 
        userId: String(user._id),
        name: user.name,
        type: 'password-reset'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return resetToken;
  } catch (error: any) {
    throw error;
  }
};
