import { NextResponse } from 'next/server'
import config, { dbEnabled, canUseDatabase } from '@/config'
import type { ApiResponse } from '@/types/api'

/**
 * Health check endpoint
 * Returns server status and configuration info
 */

export async function GET() {
  const health: ApiResponse<{
    status: string
    timestamp: string
    environment: string
    database: {
      enabled: boolean
      canConnect: boolean
    }
  }> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.APP_ENV,
      database: {
        enabled: dbEnabled,
        canConnect: canUseDatabase(),
      },
    },
  }

  return NextResponse.json(health)
}
