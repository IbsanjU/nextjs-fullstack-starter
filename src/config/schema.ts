import { z } from 'zod'

// Zod schema for environment variables with defaults
const envSchema = z.object({
  // Environment
  APP_ENV: z.enum(['local', 'development', 'staging', 'production']).default('local'),

  // App metadata
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Database feature flags
  ENABLE_DB: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  LOCAL_DB: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // Database connection
  DATABASE_URL: z.string().default('postgresql://app:app@localhost:5432/app?schema=public'),

  // Node environment (internal)
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type EnvConfig = z.infer<typeof envSchema>

export default envSchema
