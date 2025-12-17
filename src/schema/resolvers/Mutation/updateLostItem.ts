import type { MutationResolvers } from './../../types.generated';

export const updateLostItem: NonNullable<MutationResolvers['updateLostItem']> = async (_parent, _arg, _ctx) => {
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
  
  const lostItem = await _ctx.LostItem.findByIdAndUpdate(
    _arg.id,
    { $set: updateData },
    { new: true }
  ).populate('lostBy');
  
  if (!lostItem) {
    throw new Error('Потерянная вещь не найдена');
  }
  
  return lostItem;
};






