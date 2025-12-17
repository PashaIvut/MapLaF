import type { MutationResolvers } from './../../types.generated';
import { requireAdmin } from '../../../utils/auth';

export const deleteLostItem: NonNullable<MutationResolvers['deleteLostItem']> = async (_parent, _arg, _ctx) => {
  const token = _ctx.request?.headers?.get('authorization')?.replace('Bearer ', '');
  await requireAdmin(_ctx, token || undefined);
  
  const item = await _ctx.LostItem.findById(_arg.id);
  
  if (!item) {
    throw new Error('Потерянная вещь не найдена');
  }
  
  await _ctx.LostItem.findByIdAndDelete(_arg.id);
  
  return true;
};




