import type { MutationResolvers } from './../../types.generated';

export const updateFoundItem: NonNullable<MutationResolvers['updateFoundItem']> = async (_parent, _arg, _ctx) => {
  const updateData: any = {};
  
  if (_arg.title !== null && _arg.title !== undefined) {
    updateData.title = _arg.title;
  }
  if (_arg.description !== null && _arg.description !== undefined) {
    updateData.description = _arg.description;
  }
  if (_arg.phone !== null && _arg.phone !== undefined) {
    updateData.phone = _arg.phone;
  }
  if (_arg.photos !== null && _arg.photos !== undefined) {
    updateData.photos = _arg.photos;
  }
  if (_arg.isReturned !== null && _arg.isReturned !== undefined) {
    updateData.isReturned = _arg.isReturned;
    if (_arg.isReturned) {
      updateData.returnedAt = new Date();
    }
  }
  
  const foundItem = await _ctx.FoundItem.findByIdAndUpdate(
    _arg.id,
    { $set: updateData },
    { new: true }
  ).populate('foundBy');
  
  if (!foundItem) {
    throw new Error('Найденная вещь не найдена');
  }
  
  return foundItem;
};






