import type { GraphQLResolveInfo } from 'graphql';
import type { IUser } from '../models/User';
import type { IFoundItem } from '../models/FoundItem';
import type { ILostItem } from '../models/LostItem';
import type { Context } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  recoveryCode: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type FoundItem = {
  __typename?: 'FoundItem';
  claimedAt?: Maybe<Scalars['String']['output']>;
  claimedBy?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  foundAt: Scalars['String']['output'];
  foundBy: User;
  id: Scalars['ID']['output'];
  isClaimed: Scalars['Boolean']['output'];
  isReturned: Scalars['Boolean']['output'];
  location?: Maybe<Location>;
  phone?: Maybe<Scalars['String']['output']>;
  photos: Array<Scalars['String']['output']>;
  returnedAt?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Location = {
  __typename?: 'Location';
  address?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type LostItem = {
  __typename?: 'LostItem';
  description: Scalars['String']['output'];
  foundItem?: Maybe<FoundItem>;
  id: Scalars['ID']['output'];
  isFound: Scalars['Boolean']['output'];
  location?: Maybe<Location>;
  lostAt: Scalars['String']['output'];
  lostBy: User;
  phone?: Maybe<Scalars['String']['output']>;
  photos: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimFoundItem: FoundItem;
  createFoundItem: FoundItem;
  createLostItem: LostItem;
  createUser: User;
  deleteFoundItem: Scalars['Boolean']['output'];
  deleteLostItem: Scalars['Boolean']['output'];
  login: AuthPayload;
  markFoundItemAsReturned: FoundItem;
  markLostItemAsFound: LostItem;
  markLostItemAsFoundSimple: LostItem;
  register: AuthPayload;
  requestPasswordReset: Scalars['String']['output'];
  resetPassword: Scalars['Boolean']['output'];
  updateFoundItem: FoundItem;
  updateLostItem: LostItem;
};


export type MutationclaimFoundItemArgs = {
  claimedBy: Scalars['ID']['input'];
  foundItemId: Scalars['ID']['input'];
};


export type MutationcreateFoundItemArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  foundBy: Scalars['ID']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};


export type MutationcreateLostItemArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  lostBy: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};


export type MutationcreateUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationdeleteFoundItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteLostItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationloginArgs = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationmarkFoundItemAsReturnedArgs = {
  foundItemId: Scalars['ID']['input'];
};


export type MutationmarkLostItemAsFoundArgs = {
  foundItemId: Scalars['ID']['input'];
  lostItemId: Scalars['ID']['input'];
};


export type MutationmarkLostItemAsFoundSimpleArgs = {
  lostItemId: Scalars['ID']['input'];
};


export type MutationregisterArgs = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationrequestPasswordResetArgs = {
  name: Scalars['String']['input'];
  recoveryCode: Scalars['String']['input'];
};


export type MutationresetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationupdateFoundItemArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isReturned?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationupdateLostItemArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  foundItem?: Maybe<FoundItem>;
  foundItems: Array<FoundItem>;
  foundItemsNearLocation: Array<FoundItem>;
  lostItem?: Maybe<LostItem>;
  lostItems: Array<LostItem>;
  lostItemsNearLocation: Array<LostItem>;
  myClaimedFoundItems: Array<FoundItem>;
  myFoundItems: Array<FoundItem>;
  myLostItems: Array<LostItem>;
  searchFoundItems: Array<FoundItem>;
  searchLostItems: Array<LostItem>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryfoundItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryfoundItemsNearLocationArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius: Scalars['Float']['input'];
};


export type QuerylostItemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerylostItemsNearLocationArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius: Scalars['Float']['input'];
};


export type QuerymyClaimedFoundItemsArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerymyFoundItemsArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerymyLostItemsArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerysearchFoundItemsArgs = {
  query: Scalars['String']['input'];
};


export type QuerysearchLostItemsArgs = {
  query: Scalars['String']['input'];
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  foundItems: Array<FoundItem>;
  id: Scalars['ID']['output'];
  lostItems: Array<LostItem>;
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<Omit<AuthPayload, 'user'> & { user: ResolversTypes['User'] }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  FoundItem: ResolverTypeWrapper<IFoundItem>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Location: ResolverTypeWrapper<Location>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  LostItem: ResolverTypeWrapper<ILostItem>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  User: ResolverTypeWrapper<IUser>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: Omit<AuthPayload, 'user'> & { user: ResolversParentTypes['User'] };
  String: Scalars['String']['output'];
  FoundItem: IFoundItem;
  ID: Scalars['ID']['output'];
  Boolean: Scalars['Boolean']['output'];
  Location: Location;
  Float: Scalars['Float']['output'];
  LostItem: ILostItem;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  User: IUser;
};

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  recoveryCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type FoundItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FoundItem'] = ResolversParentTypes['FoundItem']> = {
  claimedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  claimedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  foundAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foundBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isClaimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isReturned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  returnedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type LocationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type LostItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LostItem'] = ResolversParentTypes['LostItem']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foundItem?: Resolver<Maybe<ResolversTypes['FoundItem']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFound?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  lostAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lostBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  claimFoundItem?: Resolver<ResolversTypes['FoundItem'], ParentType, ContextType, RequireFields<MutationclaimFoundItemArgs, 'claimedBy' | 'foundItemId'>>;
  createFoundItem?: Resolver<ResolversTypes['FoundItem'], ParentType, ContextType, RequireFields<MutationcreateFoundItemArgs, 'foundBy' | 'title'>>;
  createLostItem?: Resolver<ResolversTypes['LostItem'], ParentType, ContextType, RequireFields<MutationcreateLostItemArgs, 'description' | 'lostBy' | 'title'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'name'>>;
  deleteFoundItem?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteFoundItemArgs, 'id'>>;
  deleteLostItem?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteLostItemArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationloginArgs, 'name' | 'password'>>;
  markFoundItemAsReturned?: Resolver<ResolversTypes['FoundItem'], ParentType, ContextType, RequireFields<MutationmarkFoundItemAsReturnedArgs, 'foundItemId'>>;
  markLostItemAsFound?: Resolver<ResolversTypes['LostItem'], ParentType, ContextType, RequireFields<MutationmarkLostItemAsFoundArgs, 'foundItemId' | 'lostItemId'>>;
  markLostItemAsFoundSimple?: Resolver<ResolversTypes['LostItem'], ParentType, ContextType, RequireFields<MutationmarkLostItemAsFoundSimpleArgs, 'lostItemId'>>;
  register?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationregisterArgs, 'name' | 'password'>>;
  requestPasswordReset?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationrequestPasswordResetArgs, 'name' | 'recoveryCode'>>;
  resetPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationresetPasswordArgs, 'newPassword' | 'token'>>;
  updateFoundItem?: Resolver<ResolversTypes['FoundItem'], ParentType, ContextType, RequireFields<MutationupdateFoundItemArgs, 'id'>>;
  updateLostItem?: Resolver<ResolversTypes['LostItem'], ParentType, ContextType, RequireFields<MutationupdateLostItemArgs, 'id'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  foundItem?: Resolver<Maybe<ResolversTypes['FoundItem']>, ParentType, ContextType, RequireFields<QueryfoundItemArgs, 'id'>>;
  foundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType>;
  foundItemsNearLocation?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType, RequireFields<QueryfoundItemsNearLocationArgs, 'latitude' | 'longitude' | 'radius'>>;
  lostItem?: Resolver<Maybe<ResolversTypes['LostItem']>, ParentType, ContextType, RequireFields<QuerylostItemArgs, 'id'>>;
  lostItems?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType>;
  lostItemsNearLocation?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType, RequireFields<QuerylostItemsNearLocationArgs, 'latitude' | 'longitude' | 'radius'>>;
  myClaimedFoundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType, RequireFields<QuerymyClaimedFoundItemsArgs, 'userId'>>;
  myFoundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType, RequireFields<QuerymyFoundItemsArgs, 'userId'>>;
  myLostItems?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType, RequireFields<QuerymyLostItemsArgs, 'userId'>>;
  searchFoundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType, RequireFields<QuerysearchFoundItemsArgs, 'query'>>;
  searchLostItems?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType, RequireFields<QuerysearchLostItemsArgs, 'query'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lostItems?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  FoundItem?: FoundItemResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  LostItem?: LostItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

