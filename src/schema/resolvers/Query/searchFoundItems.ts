
import type { QueryResolvers } from './../../types.generated';

export const searchFoundItems: NonNullable<QueryResolvers['searchFoundItems']> = async (_parent, _arg, _ctx) => {
  const searchQuery = {
    $or: [
      { title: { $regex: _arg.query, $options: 'i' } },
      { description: { $regex: _arg.query, $options: 'i' } },
      { 'location.address': { $regex: _arg.query, $options: 'i' } },
    ],
  };
  
  return _ctx.FoundItem.find(searchQuery).populate('foundBy');
};