import type { MutationResolvers } from './../../types.generated';

export const markLostItemAsFoundSimple: NonNullable<MutationResolvers['markLostItemAsFoundSimple']> = async (_parent, _arg, _ctx) => {
  const item = await _ctx.LostItem.findById(_arg.lostItemId).populate('lostBy');
  
  if (!item) {
    throw new Error('Потерянная вещь не найдена.');
  }
  
  if (item.isFound) {
    throw new Error('Эта вещь уже помечена как найденная.');
  }
  
  item.isFound = true;
  
  await item.save();
  return item.populate('lostBy');
};


