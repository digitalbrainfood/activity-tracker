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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { IconMessage, IconArrowUp, IconArrowDown, IconSend, IconMessageCircle, IconPhoto } from "@tabler/icons-react"
import { useMessages } from "@/hooks/use-ringcentral"
import type { MessageRecord } from "@/lib/types"

const messagesByDay = [
  { day: "Mon", sent: 340, received: 280 },
  { day: "Tue", sent: 380, received: 320 },
  { day: "Wed", sent: 290, received: 250 },
  { day: "Thu", sent: 420, received: 360 },
  { day: "Fri", sent: 390, received: 340 },
  { day: "Sat", sent: 120, received: 90 },
  { day: "Sun", sent: 85, received: 60 },
]

const chartConfig = {
  sent: { label: "Sent", color: "hsl(var(--chart-1))" },
  received: { label: "Received", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const conversations = [
  {
    id: 1,
    contact: "+1 (555) 123-4567",
    name: "John Smith",
    lastMessage: "Thanks for the follow-up! I'll review the proposal and get back to you by Friday.",
    time: "2:45 PM",
    unread: 0,
    employee: "Sarah Johnson",
    type: "SMS"
  },
  {
    id: 2,
    contact: "+1 (555) 234-5678",
    name: "Jane Doe",
    lastMessage: "Can you send me the updated pricing sheet?",
    time: "2:30 PM",
    unread: 2,
    employee: "Mike Chen",
    type: "SMS"
  },
  {
    id: 3,
    contact: "+1 (555) 345-6789",
    name: "Bob Wilson",
    lastMessage: "Perfect, I'll see you at 3pm tomorrow.",
    time: "1:15 PM",
    unread: 0,
    employee: "Emily Davis",
    type: "MMS"
  },
  {
    id: 4,
    contact: "+1 (555) 456-7890",
    name: "Alice Brown",
    lastMessage: "The demo went great! Let's schedule a follow-up call.",
    time: "12:30 PM",
    unread: 1,
    employee: "James Wilson",
    type: "SMS"
  },
  {
    id: 5,
    contact: "+1 (555) 567-8901",
    name: "Charlie Davis",
    lastMessage: "I've attached the contract for your review.",
    time: "11:45 AM",
    unread: 0,
    employee: "Sarah Johnson",
    type: "MMS"
  },
  {
    id: 6,
    contact: "+1 (555) 678-9012",
    name: "Diana Lee",
    lastMessage: "Thank you for your patience. We're processing your order now.",
    time: "10:30 AM",
    unread: 0,
    employee: "Lisa Wong",
    type: "SMS"
  },
]

const sentMessages = [
  { id: 1, to: "+1 (555) 987-6543", from: "Sarah Johnson", message: "Hi! Just following up on our conversation...", time: "3:00 PM", status: "Delivered" },
  { id: 2, to: "+1 (555) 876-5432", from: "Mike Chen", message: "Here's the quote you requested.", time: "2:45 PM", status: "Delivered" },
  { id: 3, to: "+1 (555) 765-4321", from: "Emily Davis", message: "Reminder: Your appointment is tomorrow at 2pm.", time: "2:30 PM", status: "Delivered" },
  { id: 4, to: "+1 (555) 654-3210", from: "James Wilson", message: "Thanks for your business!", time: "2:15 PM", status: "Read" },
  { id: 5, to: "+1 (555) 543-2109", from: "Sarah Johnson", message: "Let me know if you have any questions.", time: "2:00 PM", status: "Read" },
]

const receivedMessages = [
  { id: 1, from: "+1 (555) 123-4567", to: "Sarah Johnson", message: "Thanks for the follow-up! I'll review...", time: "2:45 PM", status: "Read" },
  { id: 2, from: "+1 (555) 234-5678", to: "Mike Chen", message: "Can you send me the updated pricing sheet?", time: "2:30 PM", status: "Unread" },
  { id: 3, from: "+1 (555) 456-7890", to: "James Wilson", message: "The demo went great! Let's schedule...", time: "12:30 PM", status: "Unread" },
  { id: 4, from: "+1 (555) 345-6789", to: "Emily Davis", message: "Perfect, I'll see you at 3pm tomorrow.", time: "1:15 PM", status: "Read" },
  { id: 5, from: "+1 (555) 567-8901", to: "Sarah Johnson", message: "I've attached the contract for review.", time: "11:45 AM", status: "Read" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Delivered":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    case "Read":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Unread":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
    case "Failed":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("")
}

function transformMessage(record: MessageRecord, type: 'sent' | 'received') {
  const toContact = record.to?.[0]?.phoneNumber || 'Unknown'
  const fromContact = record.from?.phoneNumber || 'Unknown'
  const contact = type === 'sent' ? toContact : fromContact

  const toName = record.to?.[0]?.name || toContact
  const fromName = record.from?.name || fromContact
  const name = type === 'sent' ? toName : fromName

  return {
    id: record.id,
    contact,
    name,
    to: type === 'sent' ? toContact : 'Current User',
    from: type === 'sent' ? 'Current User' : fromContact,
    message: record.subject || 'No content',
    time: new Date(record.creationTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: record.readStatus === 'Read' ? 'Read' : (record.messageStatus === 'Delivered' ? 'Delivered' : 'Unread'),
    employee: 'Current User',
    type: record.type,
  }
}

export default function MessagesPage() {
  const { data: messagesData, loading, error } = useMessages()

  // Transform real data or use placeholder
  const isConnected = !error && messagesData?.records && messagesData.records.length > 0

  const realSentMessages = messagesData?.records
    ?.filter(m => m.direction === 'Outbound')
    .map(m => transformMessage(m, 'sent')) || []

  const realReceivedMessages = messagesData?.records
    ?.filter(m => m.direction === 'Inbound')
    .map(m => transformMessage(m, 'received')) || []

  // Use real or placeholder data
  const displaySentMessages = isConnected ? realSentMessages : sentMessages
  const displayReceivedMessages = isConnected ? realReceivedMessages : receivedMessages
  const displayConversations = isConnected
    ? [...realSentMessages, ...realReceivedMessages].slice(0, 6).map(msg => ({
        ...msg,
        lastMessage: msg.message,
        unread: 0,
      }))
    : conversations

  // Calculate stats
  const totalSent = isConnected ? realSentMessages.length : 234
  const totalReceived = isConnected ? realReceivedMessages.length : 189
  const unreadCount = isConnected
    ? messagesData?.records?.filter(m => m.readStatus === 'Unread').length || 0
    : 12

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
              <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
              <p className="text-muted-foreground">SMS and MMS messages from RingCentral.</p>
            </div>
            <Button>
              <IconSend className="size-4 mr-2" />
              New Message
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Sent</CardDescription>
                <IconArrowUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent}</div>
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Sample data'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Received</CardDescription>
                <IconArrowDown className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReceived}</div>
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Sample data'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Unread</CardDescription>
                <IconMessageCircle className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                <p className="text-xs text-muted-foreground">{unreadCount > 0 ? 'Needs attention' : 'All caught up'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Total Messages</CardDescription>
                <IconPhoto className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent + totalReceived}</div>
                <p className="text-xs text-muted-foreground">All messages</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>Messages sent and received this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={messagesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="received" stroke="var(--color-received)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="conversations" className="w-full">
            <TabsList>
              <TabsTrigger value="conversations">
                <IconMessage className="size-4 mr-2" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="sent">
                <IconArrowUp className="size-4 mr-2" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="received">
                <IconArrowDown className="size-4 mr-2" />
                Received
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversations">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                  <CardDescription>Active message threads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayConversations.map((conv) => (
                    <div key={conv.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <Avatar>
                        <AvatarFallback>{getInitials(conv.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{conv.name}</span>
                            <Badge variant="outline" className="text-xs">{conv.type}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{conv.contact}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{conv.employee}</span>
                        </div>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-primary">{conv.unread}</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                  <CardDescription>Messages sent today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displaySentMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{msg.from}</span>
                            <IconArrowUp className="size-3 text-muted-foreground" />
                            <span className="font-mono text-sm">{msg.to}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                      </div>
                      {getStatusBadge(msg.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="received">
              <Card>
                <CardHeader>
                  <CardTitle>Received Messages</CardTitle>
                  <CardDescription>Messages received today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayReceivedMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{msg.from}</span>
                            <IconArrowDown className="size-3 text-muted-foreground" />
                            <span className="font-medium">{msg.to}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                      </div>
                      {getStatusBadge(msg.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
