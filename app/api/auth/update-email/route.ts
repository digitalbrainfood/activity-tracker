import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUserEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Update email in database
    await updateUserEmail(Number(user.id), email)

    return NextResponse.json({ success: true, message: 'Email updated' })
  } catch (error) {
    console.error('Update email error:', error)
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 })
  }
}
