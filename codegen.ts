import type { CodegenConfig } from '@graphql-codegen/cli'
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'

const config: CodegenConfig = {
  schema: 'src/schema/schema.graphql',
  generates: {
    'src/schema': defineConfig({
      typesPluginsConfig: {
        contextType: '../context#Context',
        mappers: {
          User: '../models/User#IUser',
          FoundItem: '../models/FoundItem#IFoundItem',
          LostItem: '../models/LostItem#ILostItem'
        }
      }
    })
  }
}

export default config

