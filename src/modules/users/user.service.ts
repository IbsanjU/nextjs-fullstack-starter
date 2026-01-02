import { userRepository } from './user.repository'
import type { User, CreateUserDto, UpdateUserDto } from './user.types'
import { logger } from '@/services/logger'

/**
 * User Service
 * Business logic layer for user operations
 */

export class UserService {
  async getAllUsers(): Promise<User[]> {
    logger.debug('Fetching all users')
    return userRepository.findAll()
  }

  async getUserById(id: string): Promise<User | null> {
    logger.debug('Fetching user by id', { id })
    return userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    logger.debug('Fetching user by email', { email })
    return userRepository.findByEmail(email)
  }

  async createUser(data: CreateUserDto): Promise<User> {
    logger.info('Creating new user', { email: data.email })

    // Business logic: check if user already exists
    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error('User with this email already exists')
    }

    return userRepository.create(data)
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    logger.info('Updating user', { id })

    // Check if user exists
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new Error('User not found')
    }

    // If email is being updated, check it's not taken
    if (data.email && data.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(data.email)
      if (emailTaken) {
        throw new Error('Email already in use')
      }
    }

    return userRepository.update(id, data)
  }

  async deleteUser(id: string): Promise<User> {
    logger.info('Deleting user', { id })

    // Check if user exists
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new Error('User not found')
    }

    return userRepository.delete(id)
  }
}

// Export singleton instance
export const userService = new UserService()
