import { PrismaClient } from '@prisma/client'
import { canUseDatabase } from '@/config'
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

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    if (!canUseDatabase()) {
      logger.warn('Database is disabled or not in Node.js runtime')
      return null as unknown as PrismaClient
    }

    logger.info('Initializing Prisma Client')
    // For Prisma v7, connection URL is configured in prisma.config.ts
    return new PrismaClient({
      log: ['error', 'warn'],
    })
  })()

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production' && canUseDatabase()) {
  globalForPrisma.prisma = prisma
}

export default prisma
