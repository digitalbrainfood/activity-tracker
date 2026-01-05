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

    // Fetch call log for ALL extensions (account level)
    const response = await platform.get('/restapi/v1.0/account/~/call-log', {
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      perPage: 100,
      view: 'Detailed',
    })

    const data = await response.json()

    // Also fetch extensions to map extension IDs to names
    const extResponse = await platform.get('/restapi/v1.0/account/~/extension', {
      type: 'User',
      status: 'Enabled',
    })
    const extData = await extResponse.json()

    // Create a map of extension ID to name
    const extensionMap: Record<string, { name: string; extensionNumber: string }> = {}
    if (extData.records) {
      for (const ext of extData.records) {
        extensionMap[ext.id] = {
          name: ext.name || `Ext ${ext.extensionNumber}`,
          extensionNumber: ext.extensionNumber || '',
        }
      }
    }

    return NextResponse.json({ ...data, extensionMap })
  } catch (error) {
    console.error('Error fetching call log:', error)
    return NextResponse.json({ error: 'Failed to fetch call log' }, { status: 500 })
  }
}
