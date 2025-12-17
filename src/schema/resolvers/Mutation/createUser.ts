
import type { MutationResolvers } from './../../types.generated';

export const createUser: NonNullable<MutationResolvers['createUser']> = async (_parent, _arg, _ctx) => {
  try {
    const existingUser = await _ctx.User.findOne({ name: _arg.name });
    if (existingUser) {
      throw new Error(`Пользователь с именем "${_arg.name}" уже существует. Пожалуйста, выберите другое имя.`);
    }
    
    const user = new _ctx.User({ name: _arg.name });
    await user.save();
    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error(`Пользователь с именем "${_arg.name}" уже существует. Пожалуйста, выберите другое имя.`);
    }
    throw error;
  }
};