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
import { Checkbox } from "@/components/ui/checkbox"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  IconMail,
  IconMailOpened,
  IconSend,
  IconInbox,
  IconStar,
  IconStarFilled,
  IconPaperclip,
  IconArrowBackUp,
  IconTrash,
  IconArchive
} from "@tabler/icons-react"

const emailVolume = [
  { day: "Mon", sent: 45, received: 62 },
  { day: "Tue", sent: 52, received: 78 },
  { day: "Wed", sent: 48, received: 55 },
  { day: "Thu", sent: 61, received: 84 },
  { day: "Fri", sent: 58, received: 71 },
  { day: "Sat", sent: 12, received: 18 },
  { day: "Sun", sent: 8, received: 15 },
]

const chartConfig = {
  sent: { label: "Sent", color: "hsl(var(--chart-1))" },
  received: { label: "Received", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const inboxEmails = [
  {
    id: 1,
    from: "john.smith@techcorp.com",
    name: "John Smith",
    subject: "Re: Proposal Review - Q1 2025 Partnership",
    preview: "Thanks for sending over the proposal. I've reviewed it with my team and we have a few questions...",
    time: "2:45 PM",
    read: false,
    starred: true,
    hasAttachment: true,
    employee: "Sarah Johnson"
  },
  {
    id: 2,
    from: "jane.doe@startup.io",
    name: "Jane Doe",
    subject: "Meeting Request - Product Demo",
    preview: "Hi, I'd like to schedule a demo of your product for our team. Are you available next week?",
    time: "1:30 PM",
    read: false,
    starred: false,
    hasAttachment: false,
    employee: "Mike Chen"
  },
  {
    id: 3,
    from: "support@vendor.com",
    name: "Vendor Support",
    subject: "Your ticket #45678 has been resolved",
    preview: "We're pleased to inform you that your support ticket has been resolved. Please review...",
    time: "12:15 PM",
    read: true,
    starred: false,
    hasAttachment: false,
    employee: "Emily Davis"
  },
  {
    id: 4,
    from: "alice.brown@enterprise.com",
    name: "Alice Brown",
    subject: "Contract Renewal Discussion",
    preview: "Our current contract is expiring next month. I'd like to discuss renewal terms...",
    time: "11:00 AM",
    read: true,
    starred: true,
    hasAttachment: true,
    employee: "James Wilson"
  },
  {
    id: 5,
    from: "newsletter@industry.com",
    name: "Industry Newsletter",
    subject: "Weekly Tech Digest - Top Stories",
    preview: "This week's top stories: AI advancements, market trends, and more...",
    time: "10:30 AM",
    read: true,
    starred: false,
    hasAttachment: false,
    employee: "Lisa Wong"
  },
]

const sentEmails = [
  {
    id: 1,
    to: "client@business.com",
    name: "Client Business",
    subject: "Follow-up: Project Timeline",
    preview: "As discussed in our call yesterday, here's the updated project timeline...",
    time: "3:00 PM",
    status: "Delivered",
    employee: "Sarah Johnson"
  },
  {
    id: 2,
    to: "prospect@newclient.com",
    name: "New Client",
    subject: "Introduction and Product Overview",
    preview: "Thank you for your interest in our services. I'm reaching out to introduce...",
    time: "2:30 PM",
    status: "Opened",
    employee: "Mike Chen"
  },
  {
    id: 3,
    to: "partner@agency.com",
    name: "Partner Agency",
    subject: "Q1 Performance Report",
    preview: "Please find attached our Q1 performance report as requested...",
    time: "1:45 PM",
    status: "Delivered",
    employee: "Emily Davis"
  },
  {
    id: 4,
    to: "lead@company.com",
    name: "Lead Company",
    subject: "Pricing Quote - Custom Solution",
    preview: "Based on your requirements, here's the detailed pricing quote...",
    time: "11:30 AM",
    status: "Opened",
    employee: "James Wilson"
  },
]

const draftEmails = [
  {
    id: 1,
    to: "team@internal.com",
    subject: "Weekly Status Update - Draft",
    preview: "Here's our weekly progress update...",
    lastEdited: "2:00 PM",
    employee: "Sarah Johnson"
  },
  {
    id: 2,
    to: "customer@support.com",
    subject: "Re: Technical Issue - Draft",
    preview: "Thank you for bringing this to our attention...",
    lastEdited: "11:00 AM",
    employee: "Emily Davis"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Opened":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Delivered":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    case "Bounced":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2)
}

export default function EmailPage() {
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Email</h2>
              <p className="text-muted-foreground">Manage email communications via RingCX.</p>
            </div>
            <Button>
              <IconSend className="size-4 mr-2" />
              Compose
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Inbox</CardDescription>
                <IconInbox className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-orange-600">12 unread</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Sent Today</CardDescription>
                <IconSend className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">+8 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Open Rate</CardDescription>
                <IconMailOpened className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-green-600">+5% this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Response Time</CardDescription>
                <IconArrowBackUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2h</div>
                <p className="text-xs text-muted-foreground">Avg. reply time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Volume</CardTitle>
              <CardDescription>Sent and received emails this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={emailVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="received" stackId="1" stroke="var(--color-received)" fill="var(--color-received)" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="sent" stackId="1" stroke="var(--color-sent)" fill="var(--color-sent)" fillOpacity={0.6} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="inbox" className="w-full">
            <TabsList>
              <TabsTrigger value="inbox">
                <IconInbox className="size-4 mr-2" />
                Inbox
                <Badge variant="secondary" className="ml-2">12</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent">
                <IconSend className="size-4 mr-2" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="drafts">
                <IconMail className="size-4 mr-2" />
                Drafts
                <Badge variant="secondary" className="ml-2">2</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Inbox</CardTitle>
                      <CardDescription>Recent incoming emails</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <IconArchive className="size-4 mr-2" />
                        Archive
                      </Button>
                      <Button variant="outline" size="sm">
                        <IconTrash className="size-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {inboxEmails.map((email) => (
                    <div key={email.id} className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer ${!email.read ? 'bg-blue-50/50' : ''}`}>
                      <Checkbox />
                      <button className="mt-1">
                        {email.starred ? (
                          <IconStarFilled className="size-4 text-yellow-500" />
                        ) : (
                          <IconStar className="size-4 text-muted-foreground" />
                        )}
                      </button>
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{getInitials(email.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`${!email.read ? 'font-semibold' : 'font-medium'}`}>{email.name}</span>
                            {email.hasAttachment && <IconPaperclip className="size-3 text-muted-foreground" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{email.time}</span>
                        </div>
                        <p className={`text-sm ${!email.read ? 'font-medium' : ''}`}>{email.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                        <span className="text-xs text-muted-foreground">Assigned to: {email.employee}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Emails</CardTitle>
                  <CardDescription>Emails sent today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {sentEmails.map((email) => (
                    <div key={email.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <Checkbox />
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{getInitials(email.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">To: {email.name}</span>
                            {getStatusBadge(email.status)}
                          </div>
                          <span className="text-xs text-muted-foreground">{email.time}</span>
                        </div>
                        <p className="text-sm">{email.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                        <span className="text-xs text-muted-foreground">Sent by: {email.employee}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drafts">
              <Card>
                <CardHeader>
                  <CardTitle>Drafts</CardTitle>
                  <CardDescription>Unsent email drafts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {draftEmails.map((email) => (
                    <div key={email.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <Checkbox />
                      <IconMail className="size-5 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">To: {email.to}</span>
                          <span className="text-xs text-muted-foreground">Edited {email.lastEdited}</span>
                        </div>
                        <p className="text-sm text-orange-600">{email.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                        <span className="text-xs text-muted-foreground">By: {email.employee}</span>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
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
