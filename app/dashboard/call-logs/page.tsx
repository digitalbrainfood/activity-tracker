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
import { IconPhone, IconArrowUp, IconArrowDown, IconPlayerPlay, IconDownload } from "@tabler/icons-react"

const callLogs = [
  { id: 1, employee: "Sarah Johnson", extension: "101", direction: "Outbound", contact: "+1 (555) 234-5678", duration: "4:32", status: "Completed", timestamp: "2025-12-25 09:15:00" },
  { id: 2, employee: "Mike Chen", extension: "102", direction: "Outbound", contact: "+1 (555) 678-9012", duration: "12:45", status: "Completed", timestamp: "2025-12-25 10:00:00" },
  { id: 3, employee: "Sarah Johnson", extension: "101", direction: "Inbound", contact: "+1 (555) 456-7890", duration: "-", status: "Missed", timestamp: "2025-12-25 09:30:00" },
  { id: 4, employee: "James Wilson", extension: "104", direction: "Outbound", contact: "+1 (555) 890-1234", duration: "8:20", status: "Completed", timestamp: "2025-12-25 10:45:00" },
  { id: 5, employee: "Sarah Johnson", extension: "101", direction: "Outbound", contact: "+1 (555) 901-2345", duration: "15:10", status: "Completed", timestamp: "2025-12-25 11:15:00" },
  { id: 6, employee: "Mike Chen", extension: "102", direction: "Inbound", contact: "+1 (555) 123-4567", duration: "6:45", status: "Completed", timestamp: "2025-12-25 12:15:00" },
  { id: 7, employee: "Emily Davis", extension: "103", direction: "Outbound", contact: "+1 (555) 234-5679", duration: "-", status: "No Answer", timestamp: "2025-12-25 12:30:00" },
  { id: 8, employee: "Sarah Johnson", extension: "101", direction: "Outbound", contact: "+1 (555) 456-7891", duration: "22:30", status: "Completed", timestamp: "2025-12-25 13:00:00" },
  { id: 9, employee: "James Wilson", extension: "104", direction: "Outbound", contact: "+1 (555) 678-9013", duration: "9:15", status: "Completed", timestamp: "2025-12-25 13:45:00" },
  { id: 10, employee: "Mike Chen", extension: "102", direction: "Outbound", contact: "+1 (555) 789-0124", duration: "-", status: "Busy", timestamp: "2025-12-25 14:15:00" },
  { id: 11, employee: "James Wilson", extension: "104", direction: "Inbound", contact: "+1 (555) 890-1235", duration: "18:45", status: "Completed", timestamp: "2025-12-25 14:45:00" },
]

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
                <CardDescription>Total Calls Today</CardDescription>
                <CardTitle className="text-3xl">47</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Outbound Calls</CardDescription>
                <CardTitle className="text-3xl">32</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">68% of total calls</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Inbound Calls</CardDescription>
                <CardTitle className="text-3xl">15</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">32% of total calls</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Missed Calls</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground text-red-600">Requires follow-up</p>
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
