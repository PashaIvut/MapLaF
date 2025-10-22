import type { CodegenConfig } from '@graphql-codegen/cli'
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'
import { User as UserModel } from './src/models/User'
import { LostItem as LostItemModel } from './src/models/LostItem'
import { FoundItem as FoundItemModel } from './src/models/FoundItem'

const config: CodegenConfig = {
  schema: '**/schema.graphql',
  generates: {
    'src/schema': defineConfig({
      mappers: {
        User: UserModel,
        LostItem: LostItemModel,
        FoundItem: FoundItemModel
      }
    })
  }
}
export default config