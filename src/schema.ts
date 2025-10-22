import { createSchema } from "graphql-yoga";

const schema = createSchema({
    typeDefs: `
    type Query {
        health: String
    }
    `,
    resolvers: {
        Query: {
            health: () => 'Ok!'
        }
    }
})

export { schema }