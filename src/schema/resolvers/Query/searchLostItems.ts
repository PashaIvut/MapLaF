
import type { QueryResolvers } from './../../types.generated';

export const searchLostItems: NonNullable<QueryResolvers['searchLostItems']> = async (_parent, _arg, _ctx) => {
  const searchQuery = {
    $or: [
      { title: { $regex: _arg.query, $options: 'i' } },
      { description: { $regex: _arg.query, $options: 'i' } },
      { 'location.address': { $regex: _arg.query, $options: 'i' } },
    ],
  };
  
  return _ctx.LostItem.find(searchQuery).populate('lostBy');
};