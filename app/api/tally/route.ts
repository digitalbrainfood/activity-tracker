import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getWeeksForUser, createWeekForUser, getUserByUsername } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get database user
    const dbUser = await getUserByUsername(user.username)
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    const weeks = await getWeeksForUser(dbUser.id)

    return NextResponse.json({ weeks })
  } catch (error) {
    console.error('Get tally error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tally data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { weekNumber, startDate, endDate } = await request.json()

    // Get database user
    const dbUser = await getUserByUsername(user.username)
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    const weekId = await createWeekForUser(dbUser.id, weekNumber, startDate, endDate)

    return NextResponse.json({ success: true, weekId })
  } catch (error) {
    console.error('Create week error:', error)
    return NextResponse.json(
      { error: 'Failed to create week' },
      { status: 500 }
    )
  }
}
