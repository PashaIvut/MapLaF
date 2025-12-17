
import type { MutationResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const markLostItemAsFound: NonNullable<MutationResolvers['markLostItemAsFound']> = async (_parent, _arg, _ctx) => {
  const lostItem = await _ctx.LostItem.findById(_arg.lostItemId);
  
  if (!lostItem) {
    throw new Error('Потерянная вещь не найдена.');
  }
  
  if (lostItem.isFound) {
    throw new Error('Эта потерянная вещь уже найдена.');
  }
  
  lostItem.isFound = true;
  lostItem.foundItem = new mongoose.Types.ObjectId(_arg.foundItemId);
  
  await lostItem.save();
  return lostItem.populate('lostBy foundItem');
};