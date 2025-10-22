/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { foundItem as Query_foundItem } from './resolvers/Query/foundItem';
import    { foundItems as Query_foundItems } from './resolvers/Query/foundItems';
import    { lostItem as Query_lostItem } from './resolvers/Query/lostItem';
import    { lostItems as Query_lostItems } from './resolvers/Query/lostItems';
import    { user as Query_user } from './resolvers/Query/user';
import    { users as Query_users } from './resolvers/Query/users';
import    { createFoundItem as Mutation_createFoundItem } from './resolvers/Mutation/createFoundItem';
import    { createLostItem as Mutation_createLostItem } from './resolvers/Mutation/createLostItem';
import    { createUser as Mutation_createUser } from './resolvers/Mutation/createUser';
import    { deleteFoundItem as Mutation_deleteFoundItem } from './resolvers/Mutation/deleteFoundItem';
import    { deleteLostItem as Mutation_deleteLostItem } from './resolvers/Mutation/deleteLostItem';
import    { updateFoundItem as Mutation_updateFoundItem } from './resolvers/Mutation/updateFoundItem';
import    { updateLostItem as Mutation_updateLostItem } from './resolvers/Mutation/updateLostItem';
import    { FoundItem } from './resolvers/FoundItem';
import    { LostItem } from './resolvers/LostItem';
import    { User } from './resolvers/User';
    export const resolvers: Resolvers = {
      Query: { foundItem: Query_foundItem,foundItems: Query_foundItems,lostItem: Query_lostItem,lostItems: Query_lostItems,user: Query_user,users: Query_users },
      Mutation: { createFoundItem: Mutation_createFoundItem,createLostItem: Mutation_createLostItem,createUser: Mutation_createUser,deleteFoundItem: Mutation_deleteFoundItem,deleteLostItem: Mutation_deleteLostItem,updateFoundItem: Mutation_updateFoundItem,updateLostItem: Mutation_updateLostItem },
      
FoundItem: FoundItem,
LostItem: LostItem,
User: User,
    }