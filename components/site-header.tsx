"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { IconPlugConnected, IconCheck } from "@tabler/icons-react"

interface SiteHeaderProps {
  isConnected?: boolean
}

export function SiteHeader({ isConnected = false }: SiteHeaderProps) {
  const handleConnect = () => {
    window.location.href = '/api/auth/ringcentral'
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Employee Activity Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          {isConnected && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <IconCheck className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          )}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Export Report
          </Button>
          {!isConnected ? (
            <Button size="sm" className="hidden sm:flex" onClick={handleConnect}>
              <IconPlugConnected className="mr-1 h-4 w-4" />
              Connect RingCentral
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="hidden sm:flex" onClick={handleConnect}>
              Reconnect
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
