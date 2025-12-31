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
import { Pie, PieChart, Cell } from "recharts"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconMessageCircle,
  IconHeart,
  IconShare,
  IconEye
} from "@tabler/icons-react"

const platformData = [
  { name: "Facebook", value: 35, fill: "#1877F2" },
  { name: "Instagram", value: 28, fill: "#E4405F" },
  { name: "Twitter", value: 22, fill: "#1DA1F2" },
  { name: "LinkedIn", value: 15, fill: "#0A66C2" },
]

const chartConfig = {
  value: { label: "Interactions" },
  Facebook: { label: "Facebook", color: "#1877F2" },
  Instagram: { label: "Instagram", color: "#E4405F" },
  Twitter: { label: "Twitter", color: "#1DA1F2" },
  LinkedIn: { label: "LinkedIn", color: "#0A66C2" },
} satisfies ChartConfig

const facebookInteractions = [
  { id: 1, type: "Message", contact: "John Smith", content: "Hi, I'm interested in your services...", time: "2:30 PM", employee: "Sarah Johnson", status: "Replied" },
  { id: 2, type: "Comment", contact: "Tech Solutions Inc", content: "Great post! Can you share more details?", time: "1:45 PM", employee: "Mike Chen", status: "Pending" },
  { id: 3, type: "Message", contact: "Jane Doe", content: "Thanks for the quick response!", time: "12:30 PM", employee: "Emily Davis", status: "Replied" },
  { id: 4, type: "Review", contact: "Bob Wilson", content: "Excellent customer service! 5 stars.", time: "11:15 AM", employee: "James Wilson", status: "Thanked" },
]

const instagramInteractions = [
  { id: 1, type: "DM", contact: "@leadcompany", content: "Love your products! Do you ship internationally?", time: "3:00 PM", employee: "Mike Chen", status: "Replied" },
  { id: 2, type: "Comment", contact: "@techbuyer", content: "This looks amazing! Price?", time: "2:15 PM", employee: "Sarah Johnson", status: "Replied" },
  { id: 3, type: "DM", contact: "@businessowner", content: "Can we schedule a demo?", time: "1:00 PM", employee: "Emily Davis", status: "Pending" },
  { id: 4, type: "Mention", contact: "@happycustomer", content: "Just received my order from @company - so happy!", time: "11:30 AM", employee: "Lisa Wong", status: "Liked" },
]

const twitterInteractions = [
  { id: 1, type: "DM", contact: "@prospect_user", content: "Saw your tweet about the new feature. Interested!", time: "2:45 PM", employee: "Sarah Johnson", status: "Replied" },
  { id: 2, type: "Mention", contact: "@techreview", content: "@company has the best customer support!", time: "2:00 PM", employee: "Mike Chen", status: "Retweeted" },
  { id: 3, type: "Reply", contact: "@curious_buyer", content: "How does this compare to competitors?", time: "1:30 PM", employee: "James Wilson", status: "Replied" },
]

const linkedinInteractions = [
  { id: 1, type: "Message", contact: "Jane Doe", content: "I'd like to discuss a potential partnership.", time: "3:15 PM", employee: "Mike Chen", status: "Replied" },
  { id: 2, type: "Connection", contact: "Robert Tech", content: "New connection request - VP at TechCorp", time: "2:30 PM", employee: "Sarah Johnson", status: "Accepted" },
  { id: 3, type: "Comment", contact: "Alice Manager", content: "Great insights in your latest article!", time: "1:45 PM", employee: "Emily Davis", status: "Replied" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Replied":
    case "Thanked":
    case "Accepted":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
    case "Retweeted":
    case "Liked":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "Facebook":
      return <IconBrandFacebook className="size-4" style={{ color: "#1877F2" }} />
    case "Instagram":
      return <IconBrandInstagram className="size-4" style={{ color: "#E4405F" }} />
    case "Twitter":
      return <IconBrandTwitter className="size-4" style={{ color: "#1DA1F2" }} />
    case "LinkedIn":
      return <IconBrandLinkedin className="size-4" style={{ color: "#0A66C2" }} />
    default:
      return <IconMessageCircle className="size-4" />
  }
}

function getInitials(name: string) {
  return name.replace("@", "").slice(0, 2).toUpperCase()
}

export default function SocialMediaPage() {
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
            <h2 className="text-2xl font-bold tracking-tight">Social Media</h2>
            <p className="text-muted-foreground">Manage interactions across all social platforms via RingCX.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Facebook</CardDescription>
                <IconBrandFacebook className="size-4" style={{ color: "#1877F2" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+12% this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Instagram</CardDescription>
                <IconBrandInstagram className="size-4" style={{ color: "#E4405F" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98</div>
                <p className="text-xs text-muted-foreground">+8% this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Twitter</CardDescription>
                <IconBrandTwitter className="size-4" style={{ color: "#1DA1F2" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76</div>
                <p className="text-xs text-muted-foreground">+15% this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>LinkedIn</CardDescription>
                <IconBrandLinkedin className="size-4" style={{ color: "#0A66C2" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">54</div>
                <p className="text-xs text-muted-foreground">+5% this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Interactions by social platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={platformData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>This week's performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <IconMessageCircle className="size-5 text-blue-500" />
                    <span className="font-medium">Messages</span>
                  </div>
                  <span className="text-2xl font-bold">248</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <IconHeart className="size-5 text-red-500" />
                    <span className="font-medium">Likes/Reactions</span>
                  </div>
                  <span className="text-2xl font-bold">1,432</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <IconShare className="size-5 text-green-500" />
                    <span className="font-medium">Shares</span>
                  </div>
                  <span className="text-2xl font-bold">89</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <IconEye className="size-5 text-purple-500" />
                    <span className="font-medium">Impressions</span>
                  </div>
                  <span className="text-2xl font-bold">15.2K</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="facebook" className="w-full">
            <TabsList>
              <TabsTrigger value="facebook">
                <IconBrandFacebook className="size-4 mr-2" />
                Facebook
              </TabsTrigger>
              <TabsTrigger value="instagram">
                <IconBrandInstagram className="size-4 mr-2" />
                Instagram
              </TabsTrigger>
              <TabsTrigger value="twitter">
                <IconBrandTwitter className="size-4 mr-2" />
                Twitter
              </TabsTrigger>
              <TabsTrigger value="linkedin">
                <IconBrandLinkedin className="size-4 mr-2" />
                LinkedIn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="facebook">
              <Card>
                <CardHeader>
                  <CardTitle>Facebook Interactions</CardTitle>
                  <CardDescription>Recent Facebook activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {facebookInteractions.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.contact)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.contact}</span>
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Handled by: {item.employee}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instagram">
              <Card>
                <CardHeader>
                  <CardTitle>Instagram Interactions</CardTitle>
                  <CardDescription>Recent Instagram activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {instagramInteractions.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.contact)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.contact}</span>
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Handled by: {item.employee}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="twitter">
              <Card>
                <CardHeader>
                  <CardTitle>Twitter Interactions</CardTitle>
                  <CardDescription>Recent Twitter activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {twitterInteractions.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.contact)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.contact}</span>
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Handled by: {item.employee}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="linkedin">
              <Card>
                <CardHeader>
                  <CardTitle>LinkedIn Interactions</CardTitle>
                  <CardDescription>Recent LinkedIn activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {linkedinInteractions.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.contact)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.contact}</span>
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Handled by: {item.employee}</p>
                      </div>
                      {getStatusBadge(item.status)}
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
