import type { QueryResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const myClaimedItems: NonNullable<QueryResolvers['myClaimedItems']> = async (_parent, _arg, _ctx) => {
  return _ctx.FoundItem.find({ 
    claimedBy: new mongoose.Types.ObjectId(_arg.userId),
    isReturned: false
  }).populate('foundBy claimedBy');
};
