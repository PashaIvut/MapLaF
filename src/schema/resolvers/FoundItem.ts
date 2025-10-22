import type   { FoundItemResolvers } from './../types.generated';
    export const FoundItem: FoundItemResolvers = {
    /* Implement FoundItem resolver logic here */
        author: ({ author }, _arg, _ctx) => {
                            /* FoundItem.author resolver is required because FoundItem.author and FoundItemMapper.author are not compatible */
                            return author
                          },
        coordinates: ({ coordinates }, _arg, _ctx) => {
                            /* FoundItem.coordinates resolver is required because FoundItem.coordinates and FoundItemMapper.coordinates are not compatible */
                            return coordinates
                          },
        createdAt: async (_parent, _arg, _ctx) => { /* FoundItem.createdAt resolver is required because FoundItem.createdAt exists but FoundItemMapper.createdAt does not */ }
    };