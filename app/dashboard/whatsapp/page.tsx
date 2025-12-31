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
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  IconBrandWhatsapp,
  IconSend,
  IconCheck,
  IconChecks,
  IconClock,
  IconSearch,
  IconPaperclip,
  IconPhoto
} from "@tabler/icons-react"

const messagesByEmployee = [
  { name: "Sarah J.", sent: 45, received: 38 },
  { name: "Mike C.", sent: 52, received: 41 },
  { name: "Emily D.", sent: 38, received: 32 },
  { name: "James W.", sent: 29, received: 25 },
  { name: "Lisa W.", sent: 61, received: 48 },
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
    avatar: "JS",
    messages: [
      { id: 1, type: "received", text: "Hi, I saw your product online. Can you tell me more about the pricing?", time: "2:30 PM" },
      { id: 2, type: "sent", text: "Hello John! Thanks for reaching out. Our pricing starts at $99/month for the basic plan.", time: "2:32 PM" },
      { id: 3, type: "received", text: "That sounds reasonable. Do you offer any discounts for annual subscriptions?", time: "2:35 PM" },
      { id: 4, type: "sent", text: "Yes! You get 2 months free when you pay annually. Would you like me to send you a detailed quote?", time: "2:36 PM" },
    ],
    unread: 0,
    lastActive: "2:36 PM",
    employee: "Sarah Johnson",
    status: "Active"
  },
  {
    id: 2,
    contact: "+1 (555) 234-5678",
    name: "Jane Doe",
    avatar: "JD",
    messages: [
      { id: 1, type: "received", text: "When will my order be shipped?", time: "1:45 PM" },
      { id: 2, type: "sent", text: "Let me check that for you. Your order #12345 is being processed.", time: "1:47 PM" },
      { id: 3, type: "received", text: "Thanks! Please keep me updated.", time: "1:50 PM" },
    ],
    unread: 1,
    lastActive: "1:50 PM",
    employee: "Mike Chen",
    status: "Waiting"
  },
  {
    id: 3,
    contact: "+1 (555) 345-6789",
    name: "Bob Wilson",
    avatar: "BW",
    messages: [
      { id: 1, type: "sent", text: "Hi Bob, just following up on our conversation yesterday.", time: "12:30 PM" },
      { id: 2, type: "received", text: "Yes, I've reviewed the proposal. Looks good!", time: "12:45 PM" },
      { id: 3, type: "sent", text: "Great! Shall we schedule a call to discuss next steps?", time: "12:47 PM" },
      { id: 4, type: "received", text: "Sure, how about tomorrow at 2pm?", time: "12:50 PM" },
      { id: 5, type: "sent", text: "Perfect! I'll send you a calendar invite.", time: "12:51 PM" },
    ],
    unread: 0,
    lastActive: "12:51 PM",
    employee: "Emily Davis",
    status: "Active"
  },
  {
    id: 4,
    contact: "+1 (555) 456-7890",
    name: "Alice Brown",
    avatar: "AB",
    messages: [
      { id: 1, type: "received", text: "I'm having trouble logging into my account.", time: "11:30 AM" },
      { id: 2, type: "sent", text: "I'm sorry to hear that. Let me help you reset your password.", time: "11:32 AM" },
    ],
    unread: 2,
    lastActive: "11:32 AM",
    employee: "James Wilson",
    status: "Pending"
  },
  {
    id: 5,
    contact: "+1 (555) 567-8901",
    name: "Charlie Davis",
    avatar: "CD",
    messages: [
      { id: 1, type: "sent", text: "Your subscription has been renewed successfully!", time: "10:00 AM" },
      { id: 2, type: "received", text: "Thank you! 👍", time: "10:15 AM" },
    ],
    unread: 0,
    lastActive: "10:15 AM",
    employee: "Lisa Wong",
    status: "Resolved"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Waiting":
    case "Pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
    case "Resolved":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function WhatsAppPage() {
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
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconBrandWhatsapp className="size-6" style={{ color: "#25D366" }} />
              WhatsApp Business
            </h2>
            <p className="text-muted-foreground">Manage WhatsApp conversations via RingCX.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Active Chats</CardDescription>
                <IconBrandWhatsapp className="size-4" style={{ color: "#25D366" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">5 need response</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Messages Today</CardDescription>
                <IconSend className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186</div>
                <p className="text-xs text-muted-foreground">92 sent, 94 received</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Avg. Response Time</CardDescription>
                <IconClock className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2m 15s</div>
                <p className="text-xs text-green-600">-30s from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Resolved Today</CardDescription>
                <IconChecks className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">95% satisfaction</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Messages by Employee</CardTitle>
                <CardDescription>Today's activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={messagesByEmployee} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
                    <Bar dataKey="received" fill="var(--color-received)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Conversations</CardTitle>
                    <CardDescription>Active WhatsApp chats</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <IconSearch className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {conversations.map((conv) => (
                  <div key={conv.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-800">{conv.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{conv.name}</span>
                          {getStatusBadge(conv.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">{conv.lastActive}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.messages[conv.messages.length - 1].text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{conv.contact}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{conv.employee}</span>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-green-500">{conv.unread}</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sample Conversation View</CardTitle>
              <CardDescription>John Smith - {conversations[0].contact}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto p-4 bg-muted/30 rounded-lg">
                {conversations[0].messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      msg.type === "sent"
                        ? "bg-green-500 text-white"
                        : "bg-white border"
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        msg.type === "sent" ? "justify-end" : ""
                      }`}>
                        <span className={`text-xs ${msg.type === "sent" ? "text-green-100" : "text-muted-foreground"}`}>
                          {msg.time}
                        </span>
                        {msg.type === "sent" && <IconChecks className="size-3 text-green-100" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="ghost" size="icon">
                  <IconPaperclip className="size-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <IconPhoto className="size-5" />
                </Button>
                <Input placeholder="Type a message..." className="flex-1" />
                <Button className="bg-green-500 hover:bg-green-600">
                  <IconSend className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
