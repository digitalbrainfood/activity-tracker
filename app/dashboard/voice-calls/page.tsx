"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { IconPhone, IconArrowUp, IconArrowDown, IconPlayerPlay, IconPhoneOff, IconPhoneIncoming, IconPhoneOutgoing } from "@tabler/icons-react"

const callsByHour = [
  { hour: "8AM", inbound: 5, outbound: 8 },
  { hour: "9AM", inbound: 12, outbound: 15 },
  { hour: "10AM", inbound: 18, outbound: 22 },
  { hour: "11AM", inbound: 15, outbound: 19 },
  { hour: "12PM", inbound: 8, outbound: 10 },
  { hour: "1PM", inbound: 10, outbound: 14 },
  { hour: "2PM", inbound: 20, outbound: 25 },
  { hour: "3PM", inbound: 16, outbound: 21 },
  { hour: "4PM", inbound: 12, outbound: 18 },
  { hour: "5PM", inbound: 6, outbound: 9 },
]

const chartConfig = {
  inbound: { label: "Inbound", color: "hsl(var(--chart-1))" },
  outbound: { label: "Outbound", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const inboundCalls = [
  { id: 1, from: "+1 (555) 123-4567", to: "Sarah Johnson", duration: "6:45", status: "Completed", time: "2:15 PM" },
  { id: 2, from: "+1 (555) 234-5678", to: "Mike Chen", duration: "-", status: "Missed", time: "1:45 PM" },
  { id: 3, from: "+1 (555) 345-6789", to: "Emily Davis", duration: "3:22", status: "Completed", time: "1:30 PM" },
  { id: 4, from: "+1 (555) 456-7890", to: "James Wilson", duration: "18:45", status: "Completed", time: "12:45 PM" },
  { id: 5, from: "+1 (555) 567-8901", to: "Sarah Johnson", duration: "-", status: "Voicemail", time: "11:30 AM" },
  { id: 6, from: "+1 (555) 678-9012", to: "Mike Chen", duration: "8:15", status: "Completed", time: "10:15 AM" },
]

const outboundCalls = [
  { id: 1, from: "Sarah Johnson", to: "+1 (555) 987-6543", duration: "4:32", status: "Completed", time: "3:00 PM" },
  { id: 2, from: "Mike Chen", to: "+1 (555) 876-5432", duration: "12:45", status: "Completed", time: "2:30 PM" },
  { id: 3, from: "Emily Davis", to: "+1 (555) 765-4321", duration: "-", status: "No Answer", time: "2:00 PM" },
  { id: 4, from: "James Wilson", to: "+1 (555) 654-3210", duration: "8:20", status: "Completed", time: "1:15 PM" },
  { id: 5, from: "Sarah Johnson", to: "+1 (555) 543-2109", duration: "15:10", status: "Completed", time: "12:00 PM" },
  { id: 6, from: "Mike Chen", to: "+1 (555) 432-1098", duration: "-", status: "Busy", time: "11:00 AM" },
  { id: 7, from: "Emily Davis", to: "+1 (555) 321-0987", duration: "22:30", status: "Completed", time: "10:00 AM" },
]

const missedCalls = [
  { id: 1, from: "+1 (555) 234-5678", to: "Mike Chen", time: "1:45 PM", callback: false },
  { id: 2, from: "+1 (555) 567-8901", to: "Sarah Johnson", time: "11:30 AM", callback: true },
  { id: 3, from: "+1 (555) 111-2222", to: "Emily Davis", time: "10:45 AM", callback: false },
  { id: 4, from: "+1 (555) 333-4444", to: "James Wilson", time: "9:30 AM", callback: true },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Missed":
    case "No Answer":
    case "Busy":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
    case "Voicemail":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function VoiceCallsPage() {
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
            <h2 className="text-2xl font-bold tracking-tight">Voice Calls</h2>
            <p className="text-muted-foreground">Monitor all voice call activity from RingCentral.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Inbound Today</CardDescription>
                <IconPhoneIncoming className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+8% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Outbound Today</CardDescription>
                <IconPhoneOutgoing className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">161</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Missed Calls</CardDescription>
                <IconPhoneOff className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">4</div>
                <p className="text-xs text-muted-foreground">2 need callback</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Avg. Duration</CardDescription>
                <IconPhone className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4:52</div>
                <p className="text-xs text-muted-foreground">Minutes per call</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calls by Hour</CardTitle>
              <CardDescription>Today's call volume distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={callsByHour}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inbound" fill="var(--color-inbound)" radius={4} />
                  <Bar dataKey="outbound" fill="var(--color-outbound)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="inbound" className="w-full">
            <TabsList>
              <TabsTrigger value="inbound">
                <IconArrowDown className="size-4 mr-2" />
                Inbound
              </TabsTrigger>
              <TabsTrigger value="outbound">
                <IconArrowUp className="size-4 mr-2" />
                Outbound
              </TabsTrigger>
              <TabsTrigger value="missed">
                <IconPhoneOff className="size-4 mr-2" />
                Missed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbound">
              <Card>
                <CardHeader>
                  <CardTitle>Inbound Calls</CardTitle>
                  <CardDescription>Calls received today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recording</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inboundCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell className="font-mono">{call.time}</TableCell>
                          <TableCell className="font-mono">{call.from}</TableCell>
                          <TableCell>{call.to}</TableCell>
                          <TableCell className="font-mono">{call.duration}</TableCell>
                          <TableCell>{getStatusBadge(call.status)}</TableCell>
                          <TableCell>
                            {call.status === "Completed" && (
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
            </TabsContent>

            <TabsContent value="outbound">
              <Card>
                <CardHeader>
                  <CardTitle>Outbound Calls</CardTitle>
                  <CardDescription>Calls made today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recording</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outboundCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell className="font-mono">{call.time}</TableCell>
                          <TableCell>{call.from}</TableCell>
                          <TableCell className="font-mono">{call.to}</TableCell>
                          <TableCell className="font-mono">{call.duration}</TableCell>
                          <TableCell>{getStatusBadge(call.status)}</TableCell>
                          <TableCell>
                            {call.status === "Completed" && (
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
            </TabsContent>

            <TabsContent value="missed">
              <Card>
                <CardHeader>
                  <CardTitle>Missed Calls</CardTitle>
                  <CardDescription>Calls that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Callback Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {missedCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell className="font-mono">{call.time}</TableCell>
                          <TableCell className="font-mono">{call.from}</TableCell>
                          <TableCell>{call.to}</TableCell>
                          <TableCell>
                            {call.callback ? (
                              <Badge className="bg-green-100 text-green-800">Called Back</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!call.callback && (
                              <Button size="sm" variant="outline">
                                <IconPhone className="size-4 mr-2" />
                                Call Back
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
