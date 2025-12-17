
import type { QueryResolvers } from './../../types.generated';

export const foundItem: NonNullable<QueryResolvers['foundItem']> = async (_parent, _arg, _ctx) => {
  return _ctx.FoundItem.findById(_arg.id).populate('foundBy');
};