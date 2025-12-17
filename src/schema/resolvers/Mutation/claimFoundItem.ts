
import type { MutationResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const claimFoundItem: NonNullable<MutationResolvers['claimFoundItem']> = async (_parent, _arg, _ctx) => {
  const item = await _ctx.FoundItem.findById(_arg.foundItemId);
  
  if (!item) {
    throw new Error('Найденная вещь не найдена.');
  }
  
  if (item.isClaimed) {
    throw new Error('Эта вещь уже заявлена.');
  }
  
  item.isClaimed = true;
  item.claimedBy = new mongoose.Types.ObjectId(_arg.claimedBy);
  item.claimedAt = new Date();
  
  await item.save();
  return item.populate('foundBy claimedBy');
};