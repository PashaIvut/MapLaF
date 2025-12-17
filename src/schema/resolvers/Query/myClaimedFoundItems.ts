import type { QueryResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const myClaimedFoundItems: NonNullable<QueryResolvers['myClaimedFoundItems']> = async (_parent, _arg, _ctx) => {
  return _ctx.FoundItem.find({ 
    claimedBy: new mongoose.Types.ObjectId(_arg.userId),
    isClaimed: true
  }).populate('foundBy claimedBy');
};




