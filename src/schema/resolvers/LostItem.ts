import type { LostItemResolvers } from './../types.generated';

export const LostItem: LostItemResolvers = {
  lostBy: async (parent, _, _ctx) => {
    if (!parent.lostBy) {
      throw new Error('Пользователь не найден для потерянной вещи');
    }
    const user = await _ctx.User.findById(parent.lostBy);
    if (!user) {
      throw new Error('Пользователь не найден для потерянной вещи');
    }
    return user;
  },
  foundItem: async (parent, _, _ctx) => {
    if (parent.foundItem) {
      return _ctx.FoundItem.findById(parent.foundItem).populate('foundBy');
    }
    return null;
  },
};