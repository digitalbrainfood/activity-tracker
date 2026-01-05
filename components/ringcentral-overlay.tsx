"use client"

import { Button } from "@/components/ui/button"
import { IconPhone } from "@tabler/icons-react"

interface RingCentralOverlayProps {
  isConnected: boolean
  isLoading?: boolean
}

export function RingCentralOverlay({ isConnected, isLoading }: RingCentralOverlayProps) {
  if (isConnected || isLoading) return null

  const handleConnect = () => {
    window.location.href = '/api/auth/ringcentral'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-white shadow-lg border max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
          <IconPhone className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Connect RingCentral</h2>
          <p className="text-muted-foreground">
            Connect your RingCentral account to view call logs, messages, and activity data.
          </p>
        </div>
        <Button onClick={handleConnect} size="lg" className="gap-2">
          <IconPhone className="w-5 h-5" />
          Connect RingCentral
        </Button>
      </div>
    </div>
  )
}
