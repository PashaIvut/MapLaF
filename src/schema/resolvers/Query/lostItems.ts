
import type { QueryResolvers } from './../../types.generated';

export const lostItems: NonNullable<QueryResolvers['lostItems']> = async (_parent, _arg, _ctx) => {
  const items = await _ctx.LostItem.find({ isFound: false });
  
  const validItems = [];
  for (const item of items) {
    if (item.lostBy) {
      const user = await _ctx.User.findById(item.lostBy);
      if (user) {
        validItems.push(item);
      }
    }
  }
  
  return validItems;
};