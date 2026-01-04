import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRingCentralSDK } from '@/lib/ringcentral'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('rc_token')

    if (!tokenCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const tokenData = JSON.parse(tokenCookie.value)
    const sdk = getRingCentralSDK()
    const platform = sdk.platform()

    // Set the stored token
    await platform.auth().setData(tokenData)

    // Fetch extensions (employees)
    const response = await platform.get('/restapi/v1.0/account/~/extension', {
      type: 'User',
      status: 'Enabled',
      perPage: 100,
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching extensions:', error)
    return NextResponse.json({ error: 'Failed to fetch extensions' }, { status: 500 })
  }
}
