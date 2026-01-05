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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconMessage, IconArrowUp, IconArrowDown, IconSend, IconMessageCircle, IconPhoto } from "@tabler/icons-react"
import { useMessages } from "@/hooks/use-ringcentral"
import type { MessageRecord } from "@/lib/types"

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

  const isConnected = !error && error !== 'Not connected' && !!(messagesData?.records && messagesData.records.length > 0)

  const realSentMessages = messagesData?.records
    ?.filter(m => m.direction === 'Outbound')
    .map(m => transformMessage(m, 'sent')) || []

  const realReceivedMessages = messagesData?.records
    ?.filter(m => m.direction === 'Inbound')
    .map(m => transformMessage(m, 'received')) || []

  // Only show real data when connected
  const displaySentMessages = realSentMessages
  const displayReceivedMessages = realReceivedMessages
  const displayConversations = [...realSentMessages, ...realReceivedMessages].slice(0, 6).map(msg => ({
    ...msg,
    lastMessage: msg.message,
    unread: 0,
  }))

  // Calculate stats
  const totalSent = realSentMessages.length
  const totalReceived = realReceivedMessages.length
  const unreadCount = messagesData?.records?.filter(m => m.readStatus === 'Unread').length || 0

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
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Connect RingCentral'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Received</CardDescription>
                <IconArrowDown className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReceived}</div>
                <p className="text-xs text-muted-foreground">{isConnected ? 'Last 30 days' : 'Connect RingCentral'}</p>
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

          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Message Volume</CardTitle>
                <CardDescription>Messages sent and received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  {totalSent + totalReceived > 0
                    ? `${totalSent} sent, ${totalReceived} received`
                    : 'No messages yet'
                  }
                </div>
              </CardContent>
            </Card>
          )}

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
      <RingCentralOverlay isConnected={isConnected} isLoading={loading} />
    </SidebarProvider>
  )
}
