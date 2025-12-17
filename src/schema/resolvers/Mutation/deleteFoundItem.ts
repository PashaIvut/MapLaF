import type { MutationResolvers } from './../../types.generated';
import { requireAdmin } from '../../../utils/auth';

export const deleteFoundItem: NonNullable<MutationResolvers['deleteFoundItem']> = async (_parent, _arg, _ctx) => {
  const token = _ctx.request?.headers?.get('authorization')?.replace('Bearer ', '');
  await requireAdmin(_ctx, token || undefined);
  
  const item = await _ctx.FoundItem.findById(_arg.id);
  
  if (!item) {
    throw new Error('Найденная вещь не найдена');
  }
  
  await _ctx.FoundItem.findByIdAndDelete(_arg.id);
  
  return true;
};




