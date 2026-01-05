"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { RingCentralOverlay } from "@/components/ringcentral-overlay"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { useCallLog, useMessages } from "@/hooks/use-ringcentral"

const barChartConfig = {
  calls: { label: "Calls", color: "hsl(var(--chart-1))" },
  messages: { label: "Messages", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const pieChartConfig = {
  value: { label: "Percentage" },
  Voice: { label: "Voice", color: "#1877F2" },
  SMS: { label: "SMS", color: "#E4405F" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const { data: callLogData, loading: callLogLoading, error: callLogError } = useCallLog()
  const { data: messagesData, loading: messagesLoading, error: messagesError } = useMessages()

  const isLoading = callLogLoading || messagesLoading
  const isConnected = !callLogError && callLogError !== 'Not connected' && !messagesError && messagesError !== 'Not connected' && !!(callLogData?.records || messagesData?.records)

  // Calculate real stats
  const totalCalls = callLogData?.records?.length || 0
  const totalMessages = messagesData?.records?.length || 0
  const totalActivity = totalCalls + totalMessages

  // Channel distribution from real data
  const channelDistribution = totalActivity > 0
    ? [
        { name: "Voice", value: Math.round((totalCalls / totalActivity) * 100), fill: "#1877F2" },
        { name: "SMS", value: Math.round((totalMessages / totalActivity) * 100), fill: "#E4405F" },
      ]
    : [
        { name: "Voice", value: 0, fill: "#1877F2" },
        { name: "SMS", value: 0, fill: "#E4405F" },
      ]

  // Calculate average call duration
  const avgDuration = callLogData?.records?.length
    ? Math.round(callLogData.records.reduce((sum, call) => sum + (call.duration || 0), 0) / callLogData.records.length)
    : 0

  const avgMinutes = Math.floor(avgDuration / 60)
  const avgSeconds = avgDuration % 60

  // Calculate response rate (completed vs total)
  const completedCalls = callLogData?.records?.filter(c =>
    c.result === 'Accepted' || c.result === 'Call connected' || c.result === 'Received'
  ).length || 0
  const responseRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0

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
        <SiteHeader isConnected={!!isConnected} />
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Insights and performance metrics for your team.</p>
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
                <CardDescription>Total Messages</CardDescription>
                <CardTitle className="text-3xl">{totalMessages}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Connect RingCentral'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Handle Time</CardDescription>
                <CardTitle className="text-3xl">{avgMinutes}:{avgSeconds.toString().padStart(2, '0')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Minutes per call</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Response Rate</CardDescription>
                <CardTitle className="text-3xl">{responseRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">Calls answered</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Type</CardTitle>
                <CardDescription>Calls vs Messages breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                  <BarChart data={[
                    { name: "Voice Calls", calls: totalCalls, messages: 0 },
                    { name: "SMS Messages", calls: 0, messages: totalMessages },
                  ]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
                    <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Voice calls vs SMS messages</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={channelDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {channelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

        </div>
      </SidebarInset>
      <RingCentralOverlay isConnected={isConnected} isLoading={isLoading} />
    </SidebarProvider>
  )
}
