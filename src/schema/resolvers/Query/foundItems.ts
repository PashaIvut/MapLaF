import type { QueryResolvers } from './../../types.generated';

export const foundItems: NonNullable<QueryResolvers['foundItems']> = async (_parent, _arg, _ctx) => {
  const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
  await _ctx.FoundItem.deleteMany({ 
    isReturned: true, 
    returnedAt: { $lt: tenHoursAgo } 
  });
  
  const items = await _ctx.FoundItem.find({ 
    isClaimed: false,
    isReturned: false 
  });
  
  const validItems = [];
  for (const item of items) {
    if (item.foundBy) {
      const user = await _ctx.User.findById(item.foundBy);
      if (user) {
        validItems.push(item);
      }
    }
  }
  
  return validItems;
};
