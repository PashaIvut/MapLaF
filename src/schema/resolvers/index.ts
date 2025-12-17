import * as Query from './Query';
import * as Mutation from './Mutation/index';
import { User } from './User';
import { FoundItem } from './FoundItem';
import { LostItem } from './LostItem';
import { Location } from './Location';

export const resolvers = {
  Query,
  Mutation,
  User,
  FoundItem,
  LostItem,
  Location,
};
