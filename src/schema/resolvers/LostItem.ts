import type   { LostItemResolvers } from './../types.generated';
    export const LostItem: LostItemResolvers = {
    /* Implement LostItem resolver logic here */
        author: ({ author }, _arg, _ctx) => {
                            /* LostItem.author resolver is required because LostItem.author and LostItemMapper.author are not compatible */
                            return author
                          },
        coordinates: ({ coordinates }, _arg, _ctx) => {
                            /* LostItem.coordinates resolver is required because LostItem.coordinates and LostItemMapper.coordinates are not compatible */
                            return coordinates
                          },
        createdAt: async (_parent, _arg, _ctx) => { /* LostItem.createdAt resolver is required because LostItem.createdAt exists but LostItemMapper.createdAt does not */ }
    };