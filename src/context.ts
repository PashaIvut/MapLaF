import { User } from './models/User';
import { FoundItem } from './models/FoundItem';
import { LostItem } from './models/LostItem';

export interface Context {
  User: typeof User;
  FoundItem: typeof FoundItem;
  LostItem: typeof LostItem;
  request?: Request;
}

