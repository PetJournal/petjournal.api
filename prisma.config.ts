import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './src/infra/repos/postgresql/prisma/schema.prisma'
})

