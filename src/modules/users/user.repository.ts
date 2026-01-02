import { prisma } from '@/lib/prisma'
import { canUseDatabase } from '@/config'
import { logger } from '@/services/logger'
import type { User, CreateUserDto, UpdateUserDto } from './user.types'

/**
 * User Repository
 * Data access layer for user operations
 * Only uses Prisma if ENABLE_DB=true
 */

export class UserRepository {
  async findAll(): Promise<User[]> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock data')
      return this.getMockUsers()
    }

    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<User | null> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock data')
      const mocks = this.getMockUsers()
      return mocks.find((u) => u.id === id) || null
    }

    return prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock data')
      const mocks = this.getMockUsers()
      return mocks.find((u) => u.email === email) || null
    }

    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: CreateUserDto): Promise<User> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock user')
      return {
        id: 'mock-id',
        email: data.email,
        name: data.name || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return prisma.user.create({
      data,
    })
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock user')
      return {
        id,
        email: data.email || 'mock@example.com',
        name: data.name || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<User> {
    if (!canUseDatabase()) {
      logger.warn('Database disabled, returning mock user')
      return {
        id,
        email: 'deleted@example.com',
        name: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return prisma.user.delete({
      where: { id },
    })
  }

  private getMockUsers(): User[] {
    return [
      {
        id: '1',
        email: 'alice@example.com',
        name: 'Alice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'bob@example.com',
        name: 'Bob',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
