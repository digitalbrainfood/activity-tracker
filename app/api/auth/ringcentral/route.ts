import { NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/ringcentral'

// Redirect to RingCentral OAuth login
export async function GET() {
  const authUrl = getAuthUrl()
  return NextResponse.redirect(authUrl)
}
