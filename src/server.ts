import { createServer } from 'http';
import {  createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { config } from './config'

function createYogaServer() {
    const yoga = createYoga({ schema })
    const server = createServer(yoga)
    server.listen(config.port, () => {
        console.log(`GraphQL сервер запущен на http://localhost:${config.port}/graphql`)
    })
}

export { createYogaServer } 

