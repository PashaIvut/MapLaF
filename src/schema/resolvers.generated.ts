/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { foundItem as Query_foundItem } from './resolvers/Query/foundItem';
import    { foundItems as Query_foundItems } from './resolvers/Query/foundItems';
import    { foundItemsNearLocation as Query_foundItemsNearLocation } from './resolvers/Query/foundItemsNearLocation';
import    { lostItem as Query_lostItem } from './resolvers/Query/lostItem';
import    { lostItems as Query_lostItems } from './resolvers/Query/lostItems';
import    { lostItemsNearLocation as Query_lostItemsNearLocation } from './resolvers/Query/lostItemsNearLocation';
import    { myClaimedFoundItems as Query_myClaimedFoundItems } from './resolvers/Query/myClaimedFoundItems';
import    { myFoundItems as Query_myFoundItems } from './resolvers/Query/myFoundItems';
import    { myLostItems as Query_myLostItems } from './resolvers/Query/myLostItems';
import    { searchFoundItems as Query_searchFoundItems } from './resolvers/Query/searchFoundItems';
import    { searchLostItems as Query_searchLostItems } from './resolvers/Query/searchLostItems';
import    { user as Query_user } from './resolvers/Query/user';
import    { users as Query_users } from './resolvers/Query/users';
import    { claimFoundItem as Mutation_claimFoundItem } from './resolvers/Mutation/claimFoundItem';
import    { createFoundItem as Mutation_createFoundItem } from './resolvers/Mutation/createFoundItem';
import    { createLostItem as Mutation_createLostItem } from './resolvers/Mutation/createLostItem';
import    { createUser as Mutation_createUser } from './resolvers/Mutation/createUser';
import    { deleteFoundItem as Mutation_deleteFoundItem } from './resolvers/Mutation/deleteFoundItem';
import    { deleteLostItem as Mutation_deleteLostItem } from './resolvers/Mutation/deleteLostItem';
import    { login as Mutation_login } from './resolvers/Mutation/login';
import    { markFoundItemAsReturned as Mutation_markFoundItemAsReturned } from './resolvers/Mutation/markFoundItemAsReturned';
import    { markLostItemAsFound as Mutation_markLostItemAsFound } from './resolvers/Mutation/markLostItemAsFound';
import    { markLostItemAsFoundSimple as Mutation_markLostItemAsFoundSimple } from './resolvers/Mutation/markLostItemAsFoundSimple';
import    { register as Mutation_register } from './resolvers/Mutation/register';
import    { requestPasswordReset as Mutation_requestPasswordReset } from './resolvers/Mutation/requestPasswordReset';
import    { resetPassword as Mutation_resetPassword } from './resolvers/Mutation/resetPassword';
import    { updateFoundItem as Mutation_updateFoundItem } from './resolvers/Mutation/updateFoundItem';
import    { updateLostItem as Mutation_updateLostItem } from './resolvers/Mutation/updateLostItem';
import    { AuthPayload } from './resolvers/AuthPayload';
import    { FoundItem } from './resolvers/FoundItem';
import    { Location } from './resolvers/Location';
import    { LostItem } from './resolvers/LostItem';
import    { User } from './resolvers/User';
    export const resolvers: Resolvers = {
      Query: { foundItem: Query_foundItem,foundItems: Query_foundItems,foundItemsNearLocation: Query_foundItemsNearLocation,lostItem: Query_lostItem,lostItems: Query_lostItems,lostItemsNearLocation: Query_lostItemsNearLocation,myClaimedFoundItems: Query_myClaimedFoundItems,myFoundItems: Query_myFoundItems,myLostItems: Query_myLostItems,searchFoundItems: Query_searchFoundItems,searchLostItems: Query_searchLostItems,user: Query_user,users: Query_users },
      Mutation: { claimFoundItem: Mutation_claimFoundItem,createFoundItem: Mutation_createFoundItem,createLostItem: Mutation_createLostItem,createUser: Mutation_createUser,deleteFoundItem: Mutation_deleteFoundItem,deleteLostItem: Mutation_deleteLostItem,login: Mutation_login,markFoundItemAsReturned: Mutation_markFoundItemAsReturned,markLostItemAsFound: Mutation_markLostItemAsFound,markLostItemAsFoundSimple: Mutation_markLostItemAsFoundSimple,register: Mutation_register,requestPasswordReset: Mutation_requestPasswordReset,resetPassword: Mutation_resetPassword,updateFoundItem: Mutation_updateFoundItem,updateLostItem: Mutation_updateLostItem },
      
      AuthPayload: AuthPayload,
FoundItem: FoundItem,
Location: Location,
LostItem: LostItem,
User: User
    }