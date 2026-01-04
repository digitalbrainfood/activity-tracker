import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRingCentralSDK } from '@/lib/ringcentral'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url))
  }

  try {
    const sdk = getRingCentralSDK()
    const platform = sdk.platform()

    // Exchange authorization code for access token
    await platform.login({
      code,
      redirect_uri: process.env.RINGCENTRAL_REDIRECT_URI!,
    })

    // Get token data
    const tokenData = await platform.auth().data()

    // Store tokens in HTTP-only cookie (encrypted in production)
    const cookieStore = await cookies()
    cookieStore.set('rc_token', JSON.stringify(tokenData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.redirect(new URL('/dashboard?connected=true', request.url))
  } catch (error) {
    console.error('RingCentral OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url))
  }
}
