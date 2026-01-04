"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useCallLog, useMessages, transformToActivityRecords } from "@/hooks/use-ringcentral"
import type { ActivityRecord } from "@/lib/types"

import placeholderData from "./data.json"

export default function Page() {
  const { data: callLogData, loading: callLogLoading, error: callLogError } = useCallLog()
  const { data: messagesData, loading: messagesLoading, error: messagesError } = useMessages()
  const [activityData, setActivityData] = useState<ActivityRecord[]>(placeholderData as unknown as ActivityRecord[])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if we have real data
    if (!callLogLoading && !messagesLoading) {
      if (callLogError === 'Not connected' || messagesError === 'Not connected') {
        // Use placeholder data when not connected
        setActivityData(placeholderData as unknown as ActivityRecord[])
        setIsConnected(false)
      } else if (callLogData || messagesData) {
        // Transform and use real data
        const realData = transformToActivityRecords(callLogData, messagesData)
        if (realData.length > 0) {
          setActivityData(realData)
          setIsConnected(true)
        } else {
          // Use placeholder if no real data available
          setActivityData(placeholderData as unknown as ActivityRecord[])
          setIsConnected(false)
        }
      }
    }
  }, [callLogData, messagesData, callLogLoading, messagesLoading, callLogError, messagesError])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader isConnected={isConnected} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                callCount={callLogData?.records?.length}
                messageCount={messagesData?.records?.length}
                isConnected={isConnected}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={activityData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
