
import type { QueryResolvers } from './../../types.generated';

export const lostItem: NonNullable<QueryResolvers['lostItem']> = async (_parent, _arg, _ctx) => {
  return _ctx.LostItem.findById(_arg.id).populate('lostBy');
};