import type { QueryResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const myFoundItems: NonNullable<QueryResolvers['myFoundItems']> = async (_parent, _arg, _ctx) => {
  return _ctx.FoundItem.find({ 
    foundBy: new mongoose.Types.ObjectId(_arg.userId) 
  }).populate('foundBy');
};






