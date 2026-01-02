'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string | null
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()

      if (data.success) {
        setUsers(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (data.success) {
        e.currentTarget.reset()
        fetchUsers()
      } else {
        alert(data.error || 'Failed to create user')
      }
    } catch (err) {
      alert('Failed to create user')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Next.js Fullstack Starter</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Production-ready starter with centralized configuration
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Create User Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create User</h2>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="John Doe"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Create User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users yet. Create one!</p>
            ) : (
              <ul className="space-y-3">
                {users.map((user) => (
                  <li key={user.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/health
              </code>
              {' - '}Health check
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">GET /api/users</code>
              {' - '}Get all users
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                POST /api/users
              </code>
              {' - '}Create a user
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
