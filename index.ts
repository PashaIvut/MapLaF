import { createYogaServer } from './src/server.ts'
import { connectDb } from './src/db.ts'

await connectDb()
createYogaServer()