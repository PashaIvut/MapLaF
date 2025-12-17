import type { FoundItemResolvers } from './../types.generated';

export const FoundItem: FoundItemResolvers = {
  foundBy: async (parent, _, _ctx) => {
    if (!parent.foundBy) {
      throw new Error('Пользователь не найден для найденной вещи');
    }
    const user = await _ctx.User.findById(parent.foundBy);
    if (!user) {
      throw new Error('Пользователь не найден для найденной вещи');
    }
    return user;
  },
  claimedBy: async (parent, _, _ctx) => {
    if (parent.claimedBy) {
      return _ctx.User.findById(parent.claimedBy);
    }
    return null;
  },
};