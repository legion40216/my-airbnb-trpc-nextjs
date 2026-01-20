// prisma.config.ts

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use your DIRECT_URL from .env (Supabase direct connection)
    url: env('DIRECT_URL'),
  },
})