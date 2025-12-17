
import type { QueryResolvers } from './../../types.generated';

export const foundItemsNearLocation: NonNullable<QueryResolvers['foundItemsNearLocation']> = async (_parent, _arg, _ctx) => {
  const allItems = await _ctx.FoundItem.find().populate('foundBy');
  
  return allItems.filter(item => {
    if (!item.location || item.location.latitude === null || item.location.latitude === undefined ||
        item.location.longitude === null || item.location.longitude === undefined) {
      return false;
    }
    
    const distance = Math.sqrt(
      Math.pow(item.location.latitude - _arg.latitude, 2) +
      Math.pow(item.location.longitude - _arg.longitude, 2)
    );
    return distance <= _arg.radius;
  });
};