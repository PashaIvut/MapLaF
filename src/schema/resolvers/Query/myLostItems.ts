import type { QueryResolvers } from './../../types.generated';
import mongoose from 'mongoose';

export const myLostItems: NonNullable<QueryResolvers['myLostItems']> = async (_parent, _arg, _ctx) => {
  return _ctx.LostItem.find({ 
    lostBy: new mongoose.Types.ObjectId(_arg.userId) 
  }).populate('lostBy');
};






