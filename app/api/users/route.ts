import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/modules/users/user.service'
import { logger } from '@/services/logger'
import type { ApiResponse } from '@/types/api'
import type { User, CreateUserDto } from '@/modules/users/user.types'

/**
 * User API Routes
 * Must use Node.js runtime for database operations
 */
export const runtime = 'nodejs'

/**
 * GET /api/users
 * Get all users
 */
export async function GET() {
  try {
    const users = await userService.getAllUsers()

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Error fetching users', error)

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error',
    }

    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data: CreateUserDto = {
      email: body.email,
      name: body.name,
    }

    // Basic validation
    if (!data.email) {
      const response: ApiResponse = {
        success: false,
        error: 'Email is required',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const user = await userService.createUser(data)

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: 'User created successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    logger.error('Error creating user', error)

    const response: ApiResponse = {
      success: false,
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error',
    }

    const status = error instanceof Error && error.message.includes('already exists') ? 409 : 500

    return NextResponse.json(response, { status })
  }
}
