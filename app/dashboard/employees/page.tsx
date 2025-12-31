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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconPhone, IconMessage, IconBrandFacebook, IconMail, IconUserPlus } from "@tabler/icons-react"

const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    extension: "101",
    department: "Sales",
    status: "Active",
    callsToday: 15,
    messagesToday: 42,
    socialToday: 8,
    emailsToday: 12,
    avgTalkTime: "5:23"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    extension: "102",
    department: "Sales",
    status: "Active",
    callsToday: 12,
    messagesToday: 38,
    socialToday: 15,
    emailsToday: 8,
    avgTalkTime: "4:45"
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    extension: "103",
    department: "Support",
    status: "Active",
    callsToday: 18,
    messagesToday: 56,
    socialToday: 5,
    emailsToday: 22,
    avgTalkTime: "6:12"
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@company.com",
    extension: "104",
    department: "Sales",
    status: "Away",
    callsToday: 8,
    messagesToday: 24,
    socialToday: 12,
    emailsToday: 6,
    avgTalkTime: "4:18"
  },
  {
    id: 5,
    name: "Lisa Wong",
    email: "lisa.wong@company.com",
    extension: "105",
    department: "Support",
    status: "Active",
    callsToday: 22,
    messagesToday: 67,
    socialToday: 3,
    emailsToday: 18,
    avgTalkTime: "3:45"
  },
  {
    id: 6,
    name: "David Park",
    email: "david.park@company.com",
    extension: "106",
    department: "Sales",
    status: "Offline",
    callsToday: 0,
    messagesToday: 0,
    socialToday: 0,
    emailsToday: 0,
    avgTalkTime: "-"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    case "Away":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
    case "Offline":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("")
}

export default function EmployeesPage() {
  const activeCount = employees.filter(e => e.status === "Active").length
  const totalCalls = employees.reduce((sum, e) => sum + e.callsToday, 0)
  const totalMessages = employees.reduce((sum, e) => sum + e.messagesToday, 0)

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
              <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
              <p className="text-muted-foreground">Manage and monitor your team's activity.</p>
            </div>
            <Button>
              <IconUserPlus className="size-4 mr-2" />
              Add Employee
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Employees</CardDescription>
                <CardTitle className="text-3xl">{employees.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{activeCount} currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Team Calls Today</CardDescription>
                <CardTitle className="text-3xl">{totalCalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Avg. {Math.round(totalCalls / activeCount)} per active employee</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Team Messages Today</CardDescription>
                <CardTitle className="text-3xl">{totalMessages}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Avg. {Math.round(totalMessages / activeCount)} per active employee</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Talk Time</CardDescription>
                <CardTitle className="text-3xl">4:52</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Across all employees</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>All employees connected to RingCentral</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Extension</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">
                      <IconPhone className="size-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <IconMessage className="size-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <IconBrandFacebook className="size-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <IconMail className="size-4 inline" />
                    </TableHead>
                    <TableHead>Avg. Talk Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="font-mono">{employee.extension}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-center font-mono">{employee.callsToday}</TableCell>
                      <TableCell className="text-center font-mono">{employee.messagesToday}</TableCell>
                      <TableCell className="text-center font-mono">{employee.socialToday}</TableCell>
                      <TableCell className="text-center font-mono">{employee.emailsToday}</TableCell>
                      <TableCell className="font-mono">{employee.avgTalkTime}</TableCell>
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
