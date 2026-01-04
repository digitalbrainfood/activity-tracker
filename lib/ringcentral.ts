import { SDK } from '@ringcentral/sdk'

// Initialize RingCentral SDK
export function getRingCentralSDK() {
  return new SDK({
    server: process.env.RINGCENTRAL_SERVER,
    clientId: process.env.RINGCENTRAL_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
    redirectUri: process.env.RINGCENTRAL_REDIRECT_URI,
  })
}

// Get authorization URL for OAuth
export function getAuthUrl() {
  const sdk = getRingCentralSDK()
  const platform = sdk.platform()
  return platform.loginUrl({
    redirectUri: process.env.RINGCENTRAL_REDIRECT_URI!,
    state: 'ringcentral-auth',
  })
}
