import type { UserResolvers } from './../types.generated';

export const User: UserResolvers = {
  foundItems: async (parent, _, _ctx) => {
    return _ctx.FoundItem.find({ foundBy: parent._id }).populate('foundBy');
  },
  lostItems: async (parent, _, _ctx) => {
    return _ctx.LostItem.find({ lostBy: parent._id }).populate('lostBy');
  },
};