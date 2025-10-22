import { createYogaServer } from './server.ts'
import { connectDb } from './db.ts'

await connectDb()
createYogaServer()