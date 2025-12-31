"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Line, LineChart } from "recharts"

const employeePerformance = [
  { name: "Sarah Johnson", calls: 45, messages: 120, social: 23 },
  { name: "Mike Chen", calls: 38, messages: 98, social: 31 },
  { name: "Emily Davis", calls: 52, messages: 142, social: 18 },
  { name: "James Wilson", calls: 41, messages: 87, social: 42 },
]

const channelDistribution = [
  { name: "Voice", value: 35, fill: "#1877F2" },
  { name: "SMS", value: 40, fill: "#E4405F" },
  { name: "Email", value: 15, fill: "#0A66C2" },
  { name: "Social", value: 10, fill: "#1DA1F2" },
]

const weeklyTrend = [
  { day: "Mon", calls: 120, messages: 340 },
  { day: "Tue", calls: 145, messages: 380 },
  { day: "Wed", calls: 132, messages: 290 },
  { day: "Thu", calls: 167, messages: 420 },
  { day: "Fri", calls: 158, messages: 390 },
  { day: "Sat", calls: 45, messages: 120 },
  { day: "Sun", calls: 32, messages: 85 },
]

const barChartConfig = {
  calls: { label: "Calls", color: "hsl(var(--chart-1))" },
  messages: { label: "Messages", color: "hsl(var(--chart-2))" },
  social: { label: "Social", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

const pieChartConfig = {
  value: { label: "Percentage" },
  Voice: { label: "Voice", color: "#1877F2" },
  SMS: { label: "SMS", color: "#E4405F" },
  Email: { label: "Email", color: "#0A66C2" },
  Social: { label: "Social", color: "#1DA1F2" },
} satisfies ChartConfig

const lineChartConfig = {
  calls: { label: "Calls", color: "hsl(var(--chart-1))" },
  messages: { label: "Messages", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export default function AnalyticsPage() {
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
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Insights and performance metrics for your team.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Calls/Employee</CardDescription>
                <CardTitle className="text-3xl">44</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Per day this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Response Rate</CardDescription>
                <CardTitle className="text-3xl">94%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">+2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Handle Time</CardDescription>
                <CardTitle className="text-3xl">4:32</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Minutes per call</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Lead Conversion</CardDescription>
                <CardTitle className="text-3xl">23%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Employee Performance</CardTitle>
                <CardDescription>Activity breakdown by employee</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                  <BarChart data={employeePerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
                    <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
                    <Bar dataKey="social" fill="var(--color-social)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Communication channels used</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Trend</CardTitle>
              <CardDescription>Calls and messages over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="calls" stroke="var(--color-calls)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="messages" stroke="var(--color-messages)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
