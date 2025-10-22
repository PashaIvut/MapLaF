import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DeleteError = {
  __typename?: 'DeleteError';
  error: DeleteErrorType;
};

export type DeleteErrorType =
  | 'INVALID_ID'
  | 'NOT_FOUND';

export type DeleteResult = DeleteError | DeleteSuccess;

export type DeleteSuccess = {
  __typename?: 'DeleteSuccess';
  success: Scalars['Boolean']['output'];
};

export type FoundItem = {
  __typename?: 'FoundItem';
  address: Scalars['String']['output'];
  author: User;
  coordinates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Item = FoundItem | LostItem;

export type ItemError = {
  __typename?: 'ItemError';
  error: ItemErrorType;
};

export type ItemErrorType =
  | 'DUPLICATE_DESCRIPTION'
  | 'INVALID_ID'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR';

export type ItemResult = ItemError | ItemSuccess;

export type ItemSuccess = {
  __typename?: 'ItemSuccess';
  item: Item;
};

export type LostItem = {
  __typename?: 'LostItem';
  address: Scalars['String']['output'];
  author: User;
  coordinates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFoundItem: ItemResult;
  createLostItem: ItemResult;
  createUser: UserResult;
  deleteFoundItem: DeleteResult;
  deleteLostItem: DeleteResult;
  updateFoundItem: ItemResult;
  updateLostItem: ItemResult;
};


export type MutationcreateFoundItemArgs = {
  address: Scalars['String']['input'];
  authorId: Scalars['ID']['input'];
  coordinates: Array<Scalars['Float']['input']>;
  description: Scalars['String']['input'];
};


export type MutationcreateLostItemArgs = {
  address: Scalars['String']['input'];
  authorId: Scalars['ID']['input'];
  coordinates: Array<Scalars['Float']['input']>;
  description: Scalars['String']['input'];
};


export type MutationcreateUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationdeleteFoundItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteLostItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationupdateFoundItemArgs = {
  address: Scalars['String']['input'];
  coordinates: Array<Scalars['Float']['input']>;
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationupdateLostItemArgs = {
  address: Scalars['String']['input'];
  coordinates: Array<Scalars['Float']['input']>;
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  foundItem: FoundItem;
  foundItems: Array<FoundItem>;
  lostItem: LostItem;
  lostItems: Array<LostItem>;
  user: User;
  users: Array<User>;
};


export type QueryfoundItemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerylostItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type UserError = {
  __typename?: 'UserError';
  error: UserErrorType;
};

export type UserErrorType =
  | 'DUPLICATE_NAME'
  | 'INVALID_ID'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR';

export type UserResult = UserError | UserSuccess;

export type UserSuccess = {
  __typename?: 'UserSuccess';
  user: User;
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



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  DeleteResult:
    | ( Omit<DeleteError, 'error'> & { error: _RefType['DeleteErrorType'] } & { __typename: 'DeleteError' } )
    | ( DeleteSuccess & { __typename: 'DeleteSuccess' } )
  ;
  Item:
    | ( FoundItem & { __typename: 'FoundItem' } )
    | ( LostItem & { __typename: 'LostItem' } )
  ;
  ItemResult:
    | ( Omit<ItemError, 'error'> & { error: _RefType['ItemErrorType'] } & { __typename: 'ItemError' } )
    | ( Omit<ItemSuccess, 'item'> & { item: _RefType['Item'] } & { __typename: 'ItemSuccess' } )
  ;
  UserResult:
    | ( Omit<UserError, 'error'> & { error: _RefType['UserErrorType'] } & { __typename: 'UserError' } )
    | ( UserSuccess & { __typename: 'UserSuccess' } )
  ;
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DeleteError: ResolverTypeWrapper<Omit<DeleteError, 'error'> & { error: ResolversTypes['DeleteErrorType'] }>;
  DeleteErrorType: ResolverTypeWrapper<'INVALID_ID' | 'NOT_FOUND'>;
  DeleteResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteResult']>;
  DeleteSuccess: ResolverTypeWrapper<DeleteSuccess>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  FoundItem: ResolverTypeWrapper<FoundItem>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Item: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Item']>;
  ItemError: ResolverTypeWrapper<Omit<ItemError, 'error'> & { error: ResolversTypes['ItemErrorType'] }>;
  ItemErrorType: ResolverTypeWrapper<'INVALID_ID' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'DUPLICATE_DESCRIPTION'>;
  ItemResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ItemResult']>;
  ItemSuccess: ResolverTypeWrapper<Omit<ItemSuccess, 'item'> & { item: ResolversTypes['Item'] }>;
  LostItem: ResolverTypeWrapper<LostItem>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  User: ResolverTypeWrapper<User>;
  UserError: ResolverTypeWrapper<Omit<UserError, 'error'> & { error: ResolversTypes['UserErrorType'] }>;
  UserErrorType: ResolverTypeWrapper<'INVALID_ID' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'DUPLICATE_NAME'>;
  UserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserResult']>;
  UserSuccess: ResolverTypeWrapper<UserSuccess>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DeleteError: DeleteError;
  DeleteResult: ResolversUnionTypes<ResolversParentTypes>['DeleteResult'];
  DeleteSuccess: DeleteSuccess;
  Boolean: Scalars['Boolean']['output'];
  FoundItem: FoundItem;
  String: Scalars['String']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Item: ResolversUnionTypes<ResolversParentTypes>['Item'];
  ItemError: ItemError;
  ItemResult: ResolversUnionTypes<ResolversParentTypes>['ItemResult'];
  ItemSuccess: Omit<ItemSuccess, 'item'> & { item: ResolversParentTypes['Item'] };
  LostItem: LostItem;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  User: User;
  UserError: UserError;
  UserResult: ResolversUnionTypes<ResolversParentTypes>['UserResult'];
  UserSuccess: UserSuccess;
};

export type DeleteErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteError'] = ResolversParentTypes['DeleteError']> = {
  error?: Resolver<ResolversTypes['DeleteErrorType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteErrorTypeResolvers = EnumResolverSignature<{ INVALID_ID?: any, NOT_FOUND?: any }, ResolversTypes['DeleteErrorType']>;

export type DeleteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteResult'] = ResolversParentTypes['DeleteResult']> = {
  __resolveType?: TypeResolveFn<'DeleteError' | 'DeleteSuccess', ParentType, ContextType>;
};

export type DeleteSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteSuccess'] = ResolversParentTypes['DeleteSuccess']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoundItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoundItem'] = ResolversParentTypes['FoundItem']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  coordinates?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = {
  __resolveType?: TypeResolveFn<'FoundItem' | 'LostItem', ParentType, ContextType>;
};

export type ItemErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemError'] = ResolversParentTypes['ItemError']> = {
  error?: Resolver<ResolversTypes['ItemErrorType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemErrorTypeResolvers = EnumResolverSignature<{ DUPLICATE_DESCRIPTION?: any, INVALID_ID?: any, NOT_FOUND?: any, VALIDATION_ERROR?: any }, ResolversTypes['ItemErrorType']>;

export type ItemResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemResult'] = ResolversParentTypes['ItemResult']> = {
  __resolveType?: TypeResolveFn<'ItemError' | 'ItemSuccess', ParentType, ContextType>;
};

export type ItemSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemSuccess'] = ResolversParentTypes['ItemSuccess']> = {
  item?: Resolver<ResolversTypes['Item'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LostItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['LostItem'] = ResolversParentTypes['LostItem']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  coordinates?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFoundItem?: Resolver<ResolversTypes['ItemResult'], ParentType, ContextType, RequireFields<MutationcreateFoundItemArgs, 'address' | 'authorId' | 'coordinates' | 'description'>>;
  createLostItem?: Resolver<ResolversTypes['ItemResult'], ParentType, ContextType, RequireFields<MutationcreateLostItemArgs, 'address' | 'authorId' | 'coordinates' | 'description'>>;
  createUser?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'password' | 'username'>>;
  deleteFoundItem?: Resolver<ResolversTypes['DeleteResult'], ParentType, ContextType, RequireFields<MutationdeleteFoundItemArgs, 'id'>>;
  deleteLostItem?: Resolver<ResolversTypes['DeleteResult'], ParentType, ContextType, RequireFields<MutationdeleteLostItemArgs, 'id'>>;
  updateFoundItem?: Resolver<ResolversTypes['ItemResult'], ParentType, ContextType, RequireFields<MutationupdateFoundItemArgs, 'address' | 'coordinates' | 'description' | 'id'>>;
  updateLostItem?: Resolver<ResolversTypes['ItemResult'], ParentType, ContextType, RequireFields<MutationupdateLostItemArgs, 'address' | 'coordinates' | 'description' | 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  foundItem?: Resolver<ResolversTypes['FoundItem'], ParentType, ContextType, RequireFields<QueryfoundItemArgs, 'id'>>;
  foundItems?: Resolver<Array<ResolversTypes['FoundItem']>, ParentType, ContextType>;
  lostItem?: Resolver<ResolversTypes['LostItem'], ParentType, ContextType, RequireFields<QuerylostItemArgs, 'id'>>;
  lostItems?: Resolver<Array<ResolversTypes['LostItem']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserError'] = ResolversParentTypes['UserError']> = {
  error?: Resolver<ResolversTypes['UserErrorType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserErrorTypeResolvers = EnumResolverSignature<{ DUPLICATE_NAME?: any, INVALID_ID?: any, NOT_FOUND?: any, VALIDATION_ERROR?: any }, ResolversTypes['UserErrorType']>;

export type UserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResult'] = ResolversParentTypes['UserResult']> = {
  __resolveType?: TypeResolveFn<'UserError' | 'UserSuccess', ParentType, ContextType>;
};

export type UserSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSuccess'] = ResolversParentTypes['UserSuccess']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DeleteError?: DeleteErrorResolvers<ContextType>;
  DeleteErrorType?: DeleteErrorTypeResolvers;
  DeleteResult?: DeleteResultResolvers<ContextType>;
  DeleteSuccess?: DeleteSuccessResolvers<ContextType>;
  FoundItem?: FoundItemResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  ItemError?: ItemErrorResolvers<ContextType>;
  ItemErrorType?: ItemErrorTypeResolvers;
  ItemResult?: ItemResultResolvers<ContextType>;
  ItemSuccess?: ItemSuccessResolvers<ContextType>;
  LostItem?: LostItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserError?: UserErrorResolvers<ContextType>;
  UserErrorType?: UserErrorTypeResolvers;
  UserResult?: UserResultResolvers<ContextType>;
  UserSuccess?: UserSuccessResolvers<ContextType>;
};

