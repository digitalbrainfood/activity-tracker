import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth'
import { getUserByUsername, updateUserPassword } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Get user from database to verify current password
    const dbUser = await getUserByUsername(user.username)
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password - support both plain text (legacy) and hashed passwords
    const isValidPassword = dbUser.password_hash.startsWith('$2')
      ? await verifyPassword(currentPassword, dbUser.password_hash)
      : currentPassword === dbUser.password_hash

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Hash and update the new password
    const newPasswordHash = await hashPassword(newPassword)
    await updateUserPassword(Number(user.id), newPasswordHash)

    return NextResponse.json({ success: true, message: 'Password updated' })
  } catch (error) {
    console.error('Update password error:', error)
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}
