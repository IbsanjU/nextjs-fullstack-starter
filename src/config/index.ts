import envSchema, { type EnvConfig } from './schema'

/**
 * SINGLE SOURCE OF TRUTH FOR ALL CONFIGURATION
 * This is the ONLY file that should read process.env
 * All other code should import `config` from this module
 */

// Parse and validate environment variables
const parseEnv = (): EnvConfig => {
  const env = {
    APP_ENV: process.env.APP_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    ENABLE_DB: process.env.ENABLE_DB,
    LOCAL_DB: process.env.LOCAL_DB,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  const result = envSchema.safeParse(env)

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    throw new Error('Invalid environment variables')
  }

  return result.data
}

// Export validated config
export const config = parseEnv()

// Helper functions
export const isProd = config.APP_ENV === 'production'
export const isDev = config.APP_ENV === 'local' || config.APP_ENV === 'development'
export const isStaging = config.APP_ENV === 'staging'
export const dbEnabled = config.ENABLE_DB
export const usingLocalDb = config.LOCAL_DB

/**
 * Runtime-safe check for Edge vs Node runtime
 * Use this before importing DB or Node-only modules
 */
export const isNodeRuntime = () => {
  try {
    // Edge runtime doesn't have process.versions.node
    return typeof process !== 'undefined' && process.versions?.node !== undefined
  } catch {
    return false
  }
}

/**
 * Check if database operations are safe to perform
 * Only true in Node.js runtime with DB enabled
 */
export const canUseDatabase = () => {
  return isNodeRuntime() && dbEnabled
}

// Export all config as default
export default config
