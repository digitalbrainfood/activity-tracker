"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { RingCentralOverlay } from "@/components/ringcentral-overlay"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconArrowUp, IconArrowDown, IconPlayerPlay, IconDownload } from "@tabler/icons-react"
import { useCallLog } from "@/hooks/use-ringcentral"
import type { CallLogRecord, CallLogResponse } from "@/lib/types"

function transformCallLog(record: CallLogRecord, callLogData: CallLogResponse | null) {
  const contact = record.direction === 'Inbound'
    ? record.from?.name || record.from?.phoneNumber || 'Unknown'
    : record.to?.name || record.to?.phoneNumber || 'Unknown'

  const minutes = Math.floor(record.duration / 60)
  const seconds = record.duration % 60
  const duration = record.duration > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '-'

  let status = 'Completed'
  if (record.result === 'Missed') status = 'Missed'
  else if (record.result === 'Voicemail') status = 'Voicemail'
  else if (record.result === 'Rejected') status = 'Busy'

  // Get employee name from extension map
  const extensionMap = callLogData?.extensionMap || {}
  const extId = record.extension?.id || ''
  const extInfo = extensionMap[extId]
  const employeeName = extInfo?.name || 'Unknown User'
  const extensionNumber = extInfo?.extensionNumber || record.extension?.id || '---'

  return {
    id: record.id,
    employee: employeeName,
    extension: extensionNumber,
    direction: record.direction,
    contact,
    duration,
    status,
    timestamp: record.startTime,
    hasRecording: !!record.recording,
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Missed":
    case "No Answer":
    case "Busy":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function CallLogsPage() {
  const { data: callLogData, loading, error } = useCallLog()

  const isConnected = !error && error !== 'Not connected' && !!(callLogData?.records && callLogData.records.length > 0)

  // Transform real data only when connected
  const callLogs = callLogData?.records
    ? callLogData.records.map(record => transformCallLog(record, callLogData))
    : []

  // Calculate stats
  const totalCalls = callLogs.length
  const outboundCalls = callLogs.filter(c => c.direction === 'Outbound').length
  const inboundCalls = callLogs.filter(c => c.direction === 'Inbound').length
  const missedCalls = callLogs.filter(c => c.status === 'Missed' || c.status === 'No Answer').length

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
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Call Logs</h2>
              <p className="text-muted-foreground">View and manage all voice call records from RingCentral.</p>
            </div>
            <Button variant="outline">
              <IconDownload className="size-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Calls</CardDescription>
                <CardTitle className="text-3xl">{totalCalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Connect RingCentral'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Outbound Calls</CardDescription>
                <CardTitle className="text-3xl">{outboundCalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{totalCalls > 0 ? Math.round((outboundCalls / totalCalls) * 100) : 0}% of total calls</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Inbound Calls</CardDescription>
                <CardTitle className="text-3xl">{inboundCalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{totalCalls > 0 ? Math.round((inboundCalls / totalCalls) * 100) : 0}% of total calls</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Missed Calls</CardDescription>
                <CardTitle className="text-3xl">{missedCalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground text-red-600">{missedCalls > 0 ? 'Requires follow-up' : 'No missed calls'}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>All voice calls from RingCentral</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recording</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(call.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{call.employee}</div>
                        <div className="text-xs text-muted-foreground">Ext. {call.extension}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={call.direction === "Outbound" ? "text-orange-600 border-orange-600" : "text-green-600 border-green-600"}>
                          {call.direction === "Outbound" ? <IconArrowUp className="size-3 mr-1" /> : <IconArrowDown className="size-3 mr-1" />}
                          {call.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{call.contact}</TableCell>
                      <TableCell className="font-mono">{call.duration}</TableCell>
                      <TableCell>{getStatusBadge(call.status)}</TableCell>
                      <TableCell>
                        {(call.status === "Completed" || call.hasRecording) && (
                          <Button variant="ghost" size="sm">
                            <IconPlayerPlay className="size-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <RingCentralOverlay isConnected={isConnected} isLoading={loading} />
    </SidebarProvider>
  )
}
