import { PrismaClient } from '@prisma/client'
import { canUseDatabase, isProd } from '@/config'
import { logger } from '@/services/logger'

/**
 * Prisma Client Singleton for Next.js
 * - Safe for development hot reload
 * - Only initialized if database is enabled and running in Node.js runtime
 * - DO NOT import this in Edge runtime routes
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Mock Prisma client for when database is disabled
class MockPrismaClient {
  [key: string]: any
  constructor() {
    return new Proxy(this, {
      get: () => {
        throw new Error('Database is disabled or not available in this runtime')
      },
    })
  }
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    if (!canUseDatabase()) {
      logger.warn('Database is disabled or not in Node.js runtime')
      return new MockPrismaClient() as unknown as PrismaClient
    }

    logger.info('Initializing Prisma Client')
    return new PrismaClient({
      log: ['error', 'warn'],
    })
  })()

// Prevent multiple instances in development
if (!isProd && canUseDatabase()) {
  globalForPrisma.prisma = prisma
}

export default prisma
