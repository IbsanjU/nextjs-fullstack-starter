'use client'

import { useState, useEffect } from 'react'
import { useTheme, type Theme } from '@/context/ThemeContext'

interface User {
  id: string
  email: string
  name: string | null
}

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'blue', label: 'Ocean', icon: '🌊' },
  { value: 'purple', label: 'Purple', icon: '💜' },
  { value: 'green', label: 'Nature', icon: '🌿' },
]

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ email: '', name: '' })
  const { theme, setTheme } = useTheme()

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

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setEditForm({ email: user.email, name: user.name || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ email: '', name: '' })
  }

  const saveEdit = async (id: string) => {
    // In a real app, you'd have a PATCH/PUT endpoint
    alert('Edit functionality would update user: ' + id)
    cancelEdit()
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    // In a real app, you'd have a DELETE endpoint
    alert('Delete functionality would remove user: ' + id)
  }

  const refreshUsers = () => {
    fetchUsers()
  }

  return (
    <main className="min-h-screen p-6 md:p-24">
      <div className="max-w-6xl mx-auto">
        {/* Header with Theme Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[rgb(var(--text-primary))]">
              Next.js Fullstack Starter
            </h1>
            <p className="text-[rgb(var(--text-secondary))]">
              Production-ready starter with centralized configuration
            </p>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="theme"
              className="text-sm font-medium text-[rgb(var(--text-secondary))]"
            >
              Theme:
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="px-4 py-2 rounded-lg bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
            >
              {themes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={refreshUsers}
            className="px-4 py-2 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            🔄 Refresh Users
          </button>
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] font-medium rounded-lg transition-colors shadow-sm"
          >
            📊 View All
          </button>
          <button
            onClick={() => alert('Export functionality would download users as CSV/JSON')}
            className="px-4 py-2 bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] font-medium rounded-lg transition-colors shadow-sm"
          >
            💾 Export
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create User Form */}
          <div className="bg-[rgb(var(--bg-secondary))] p-6 rounded-xl shadow-lg border border-[rgb(var(--border))]">
            <h2 className="text-2xl font-semibold mb-4 text-[rgb(var(--text-primary))]">
              Create User
            </h2>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-[rgb(var(--text-primary))]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-[rgb(var(--border))] rounded-lg bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-[rgb(var(--text-primary))]"
                >
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-[rgb(var(--border))] rounded-lg bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                  ➕ Create User
                </button>
                <button
                  type="reset"
                  className="px-4 py-2 bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--border))] text-[rgb(var(--text-primary))] font-medium rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-[rgb(var(--bg-secondary))] p-6 rounded-xl shadow-lg border border-[rgb(var(--border))]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[rgb(var(--text-primary))]">Users</h2>
              <span className="text-sm text-[rgb(var(--text-secondary))]">
                {users.length} {users.length === 1 ? 'user' : 'users'}
              </span>
            </div>
            {loading ? (
              <p className="text-[rgb(var(--text-secondary))]">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-[rgb(var(--text-secondary))]">No users yet. Create one!</p>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="p-4 bg-[rgb(var(--bg-tertiary))] rounded-lg border border-[rgb(var(--border))] hover:shadow-md transition-shadow"
                  >
                    {editingId === user.id ? (
                      <div className="space-y-2">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-1 border border-[rgb(var(--border))] rounded bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]"
                        />
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-1 border border-[rgb(var(--border))] rounded bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(user.id)}
                            className="px-3 py-1 bg-[rgb(var(--accent))] text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] text-[rgb(var(--text-primary))] rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2">
                          <p className="font-medium text-[rgb(var(--text-primary))]">
                            {user.name || 'No name'}
                          </p>
                          <p className="text-sm text-[rgb(var(--text-secondary))]">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="px-3 py-1 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white text-sm rounded transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-[rgb(var(--bg-secondary))] p-6 rounded-xl border border-[rgb(var(--border))] shadow-lg">
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--text-primary))]">
            API Endpoints
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <code className="bg-[rgb(var(--bg-tertiary))] px-3 py-1 rounded border border-[rgb(var(--border))] text-[rgb(var(--text-primary))]">
                GET /api/health
              </code>
              <span className="text-[rgb(var(--text-secondary))]">- Health check</span>
            </li>
            <li className="flex items-center gap-2">
              <code className="bg-[rgb(var(--bg-tertiary))] px-3 py-1 rounded border border-[rgb(var(--border))] text-[rgb(var(--text-primary))]">
                GET /api/users
              </code>
              <span className="text-[rgb(var(--text-secondary))]">- Get all users</span>
            </li>
            <li className="flex items-center gap-2">
              <code className="bg-[rgb(var(--bg-tertiary))] px-3 py-1 rounded border border-[rgb(var(--border))] text-[rgb(var(--text-primary))]">
                POST /api/users
              </code>
              <span className="text-[rgb(var(--text-secondary))]">- Create a user</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
