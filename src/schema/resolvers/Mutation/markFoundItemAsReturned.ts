import type { MutationResolvers } from './../../types.generated';

export const markFoundItemAsReturned: NonNullable<MutationResolvers['markFoundItemAsReturned']> = async (_parent, _arg, _ctx) => {
  const item = await _ctx.FoundItem.findById(_arg.foundItemId).populate('foundBy');
  
  if (!item) {
    throw new Error('Найденная вещь еще не возвращена.');
  }
  
  if (item.isClaimed) {
    throw new Error('Эта вещь уже возвращена.');
  }
  
  item.isClaimed = true;
  item.claimedAt = new Date();
  
  await item.save();
  return item.populate('foundBy');
};


