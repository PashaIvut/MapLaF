import type   { UserResolvers } from './../types.generated';
    export const User: UserResolvers = {
    /* Implement User resolver logic here */
        createdAt: ({ createdAt }, _arg, _ctx) => {
                            /* User.createdAt resolver is required because User.createdAt and UserMapper.createdAt are not compatible */
                            return createdAt
                          }
    };