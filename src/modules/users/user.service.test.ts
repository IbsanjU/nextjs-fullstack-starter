import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from './user.service'
import { userRepository } from './user.repository'
import type { CreateUserDto } from './user.types'

// Mock the repository
vi.mock('./user.repository', () => ({
  userRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    vi.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      }

      const mockUser = {
        id: '1',
        email: createDto.email,
        name: createDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(userRepository.create).mockResolvedValue(mockUser)

      const result = await userService.createUser(createDto)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(createDto.email)
      expect(userRepository.create).toHaveBeenCalledWith(createDto)
      expect(result).toEqual(mockUser)
    })

    it('should throw error if email already exists', async () => {
      const createDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Test User',
      }

      const existingUser = {
        id: '1',
        email: createDto.email,
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser)

      await expect(userService.createUser(createDto)).rejects.toThrow(
        'User with this email already exists'
      )

      expect(userRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(userRepository.findAll).mockResolvedValue(mockUsers)

      const result = await userService.getAllUsers()

      expect(userRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockUsers)
    })
  })
})
