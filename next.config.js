/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Prisma client external packages
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
