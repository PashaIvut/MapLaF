import type { MutationResolvers } from './../../types.generated';
import mongoose from 'mongoose';

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
}

function areItemsSimilar(item1: any, item2: any): boolean {
  const title1 = normalizeText(item1.title || '');
  const title2 = normalizeText(item2.title || '');
  const desc1 = normalizeText(item1.description || '');
  const desc2 = normalizeText(item2.description || '');
  
  const titleSimilarity = calculateSimilarity(title1, title2);
  if (titleSimilarity < 0.8) {
    return false;
  }
  
  if (desc1 && desc2) {
    const descSimilarity = calculateSimilarity(desc1, desc2);
    if (descSimilarity < 0.7) {
      return false;
    }
  }
  
  if (item1.location?.address && item2.location?.address) {
    const addr1 = normalizeText(item1.location.address);
    const addr2 = normalizeText(item2.location.address);
    if (addr1 !== addr2) {
      return false;
    }
  }
  
  return true;
}

function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const rows = str2.length + 1;
  const cols = str1.length + 1;
  const matrix: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i]![0] = i;
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0]![j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1
        );
      }
    }
  }
  
  return matrix[str2.length]![str1.length]!;
}

export const createLostItem: NonNullable<MutationResolvers['createLostItem']> = async (_parent, _arg, _ctx) => {
  const recentItems = await _ctx.LostItem.find({
    lostBy: new mongoose.Types.ObjectId(_arg.lostBy),
    lostAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  }).limit(50);
  
  const newItem = {
    title: _arg.title,
    description: _arg.description || '',
    location: _arg.address ? { address: _arg.address } : undefined
  };
  
  for (const existingItem of recentItems) {
    if (areItemsSimilar(newItem, existingItem)) {
      throw new Error('Похожее объявление уже было создано недавно. Пожалуйста, проверьте, не дублируете ли вы объявление.');
    }
  }
  
  const location = (_arg.latitude !== null && _arg.latitude !== undefined && 
                    _arg.longitude !== null && _arg.longitude !== undefined) ? { 
    latitude: _arg.latitude, 
    longitude: _arg.longitude, 
    address: _arg.address 
  } : _arg.address ? {
    address: _arg.address 
  } : undefined;
  
  const lostItem = new _ctx.LostItem({
    title: _arg.title,
    description: _arg.description,
    location,
    lostBy: new mongoose.Types.ObjectId(_arg.lostBy),
    phone: _arg.phone,
    photos: _arg.photos || [],
  });
  
  await lostItem.save();
  return lostItem.populate('lostBy');
};