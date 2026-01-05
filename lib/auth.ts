import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getUserByUsername as getDbUser } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'activity-tracker-secret-key-change-in-production'

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'employee'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const dbUser = await getDbUser(username)
  if (!dbUser) return null

  // Check password - support both plain text (legacy) and hashed passwords
  const isValidPassword = dbUser.password_hash.startsWith('$2')
    ? await verifyPassword(password, dbUser.password_hash)
    : password === dbUser.password_hash

  if (!isValidPassword) return null

  return {
    id: String(dbUser.id),
    username: dbUser.username,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as 'admin' | 'employee',
  }
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}
