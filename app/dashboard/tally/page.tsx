"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconPlus, IconChevronLeft, IconChevronRight, IconDownload, IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/hooks/use-auth"

const ACTIVITY_COLUMNS = [
  { key: "textNewRecruits", label: "Text New Recruits" },
  { key: "callsToRecruits", label: "Calls to Recruits" },
  { key: "textInterviews", label: "Text/Interviews" },
  { key: "instaDMs", label: "Insta DMs" },
  { key: "initialInterviews", label: "Initial Interviews" },
] as const

type ActivityKey = typeof ACTIVITY_COLUMNS[number]["key"]

interface TallyEntry {
  id: number
  day: string
  textNewRecruits: number
  callsToRecruits: number
  textInterviews: number
  instaDMs: number
  initialInterviews: number
}

interface WeekData {
  id: number
  week_number: number
  start_date: string
  end_date: string
  entries: TallyEntry[]
}

function getWeekDates(weekOffset: number = 0) {
  const today = new Date()
  const currentDay = today.getDay()
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  const monday = new Date(today)
  monday.setDate(diff - (7 * weekOffset))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    startDate: monday.toISOString().split("T")[0],
    endDate: sunday.toISOString().split("T")[0],
  }
}

export default function TallyPage() {
  const { user } = useAuth()
  const [weeks, setWeeks] = React.useState<WeekData[]>([])
  const [currentWeekIndex, setCurrentWeekIndex] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [dbInitialized, setDbInitialized] = React.useState(false)

  const currentWeek = weeks[currentWeekIndex]

  // Initialize database and fetch weeks
  const initAndFetch = React.useCallback(async () => {
    try {
      // Initialize database tables first
      if (!dbInitialized) {
        await fetch("/api/db/init")
        setDbInitialized(true)
      }

      const response = await fetch("/api/tally")
      if (response.ok) {
        const data = await response.json()
        if (data.weeks && data.weeks.length > 0) {
          setWeeks(data.weeks)
        }
      }
    } catch (error) {
      console.error("Failed to fetch weeks:", error)
    } finally {
      setLoading(false)
    }
  }, [dbInitialized])

  React.useEffect(() => {
    initAndFetch()
  }, [initAndFetch])

  const createNewWeek = async (weekNumber: number) => {
    const { startDate, endDate } = getWeekDates(weeks.length)

    try {
      const response = await fetch("/api/tally", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNumber, startDate, endDate }),
      })

      if (response.ok) {
        await initAndFetch()
        setCurrentWeekIndex(weeks.length)
      }
    } catch (error) {
      console.error("Failed to create week:", error)
    }
  }

  const handleCellChange = async (entryId: number, key: ActivityKey, value: string) => {
    const numValue = parseInt(value) || 0

    // Optimistic update
    setWeeks(prev =>
      prev.map((week, idx) =>
        idx === currentWeekIndex
          ? {
              ...week,
              entries: week.entries.map(entry =>
                entry.id === entryId
                  ? { ...entry, [key]: numValue }
                  : entry
              ),
            }
          : week
      )
    )

    // Save to database
    setSaving(true)
    try {
      await fetch("/api/tally/entry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, field: key, value: numValue }),
      })
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const addWeek = async () => {
    await createNewWeek(weeks.length + 1)
  }

  const calculateTotal = (key: ActivityKey) => {
    if (!currentWeek?.entries) return 0
    return currentWeek.entries.reduce((sum, entry) => sum + (entry[key] || 0), 0)
  }

  const calculateGrandTotal = () => {
    if (!currentWeek?.entries) return 0
    return currentWeek.entries.reduce(
      (sum, entry) =>
        sum +
        (entry.textNewRecruits || 0) +
        (entry.callsToRecruits || 0) +
        (entry.textInterviews || 0) +
        (entry.instaDMs || 0) +
        (entry.initialInterviews || 0),
      0
    )
  }

  const exportToCSV = () => {
    if (!currentWeek) return

    const headers = ["Day", ...ACTIVITY_COLUMNS.map(c => c.label), "Daily Total"]
    const rows = currentWeek.entries.map(entry => [
      entry.day,
      entry.textNewRecruits || 0,
      entry.callsToRecruits || 0,
      entry.textInterviews || 0,
      entry.instaDMs || 0,
      entry.initialInterviews || 0,
      (entry.textNewRecruits || 0) + (entry.callsToRecruits || 0) + (entry.textInterviews || 0) + (entry.instaDMs || 0) + (entry.initialInterviews || 0),
    ])

    const totalsRow = [
      "TOTAL",
      calculateTotal("textNewRecruits"),
      calculateTotal("callsToRecruits"),
      calculateTotal("textInterviews"),
      calculateTotal("instaDMs"),
      calculateTotal("initialInterviews"),
      calculateGrandTotal(),
    ]

    const csvContent = [
      `Employee: ${user?.name || "Unknown"}`,
      `Week: ${currentWeek.start_date} to ${currentWeek.end_date}`,
      "",
      headers.join(","),
      ...rows.map(r => r.join(",")),
      totalsRow.join(","),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tally-week${currentWeek.week_number}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
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
          <div className="flex flex-1 items-center justify-center">
            <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Show create first week button if no weeks exist
  if (weeks.length === 0) {
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
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">No activity data yet</h2>
            <p className="text-muted-foreground">Create your first week to start tracking activities</p>
            <Button onClick={() => createNewWeek(1)}>
              <IconPlus className="size-4 mr-2" />
              Create First Week
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
              <h2 className="text-2xl font-bold tracking-tight">Activity Tally</h2>
              <p className="text-muted-foreground">Track your weekly activities</p>
            </div>
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
              <Button variant="outline" onClick={exportToCSV}>
                <IconDownload className="size-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">{user?.name || "Loading..."}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1))}
                disabled={currentWeekIndex === 0}
              >
                <IconChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                Week {currentWeek?.week_number || 1}
                {currentWeek && (
                  <span className="text-muted-foreground text-xs block">
                    {currentWeek.start_date} - {currentWeek.end_date}
                  </span>
                )}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentWeekIndex(Math.min(weeks.length - 1, currentWeekIndex + 1))
                }
                disabled={currentWeekIndex >= weeks.length - 1}
              >
                <IconChevronRight className="size-4" />
              </Button>
              <Button variant="outline" onClick={addWeek}>
                <IconPlus className="size-4 mr-2" />
                Add Week
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Log</CardTitle>
              <CardDescription>
                Click on any cell to edit. Values are saved automatically to the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Day</TableHead>
                      {ACTIVITY_COLUMNS.map((col) => (
                        <TableHead key={col.key} className="text-center min-w-[130px]">
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[100px] bg-muted/50">Daily Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentWeek?.entries?.map((entry) => {
                      const dailyTotal =
                        (entry.textNewRecruits || 0) +
                        (entry.callsToRecruits || 0) +
                        (entry.textInterviews || 0) +
                        (entry.instaDMs || 0) +
                        (entry.initialInterviews || 0)
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.day}</TableCell>
                          {ACTIVITY_COLUMNS.map((col) => (
                            <TableCell key={col.key} className="p-1">
                              <Input
                                type="number"
                                min="0"
                                value={entry[col.key] || 0}
                                onChange={(e) => handleCellChange(entry.id, col.key, e.target.value)}
                                className="h-8 text-center"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-semibold bg-muted/50">
                            {dailyTotal}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>TOTAL</TableCell>
                      {ACTIVITY_COLUMNS.map((col) => (
                        <TableCell key={col.key} className="text-center">
                          {calculateTotal(col.key)}
                        </TableCell>
                      ))}
                      <TableCell className="text-center bg-primary/10 text-primary font-bold">
                        {calculateGrandTotal()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Weeks Summary</CardTitle>
              <CardDescription>
                Overview of all tracked weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Week</TableHead>
                      {ACTIVITY_COLUMNS.map((col) => (
                        <TableHead key={col.key} className="text-center min-w-[130px]">
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[100px] bg-muted/50">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeks.map((week, idx) => {
                      const weekTotal = week.entries?.reduce(
                        (sum, entry) =>
                          sum +
                          (entry.textNewRecruits || 0) +
                          (entry.callsToRecruits || 0) +
                          (entry.textInterviews || 0) +
                          (entry.instaDMs || 0) +
                          (entry.initialInterviews || 0),
                        0
                      ) || 0
                      return (
                        <TableRow
                          key={week.id}
                          className={idx === currentWeekIndex ? "bg-muted/20" : "cursor-pointer hover:bg-muted/10"}
                          onClick={() => setCurrentWeekIndex(idx)}
                        >
                          <TableCell className="font-medium">
                            Week {week.week_number}
                            <span className="text-muted-foreground text-xs block">
                              {week.start_date}
                            </span>
                          </TableCell>
                          {ACTIVITY_COLUMNS.map((col) => (
                            <TableCell key={col.key} className="text-center">
                              {week.entries?.reduce((sum, entry) => sum + (entry[col.key] || 0), 0) || 0}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-semibold bg-muted/50">
                            {weekTotal}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>GRAND TOTAL</TableCell>
                      {ACTIVITY_COLUMNS.map((col) => (
                        <TableCell key={col.key} className="text-center">
                          {weeks.reduce(
                            (total, week) =>
                              total + (week.entries?.reduce((sum, entry) => sum + (entry[col.key] || 0), 0) || 0),
                            0
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-center bg-primary/10 text-primary font-bold">
                        {weeks.reduce(
                          (total, week) =>
                            total +
                            (week.entries?.reduce(
                              (sum, entry) =>
                                sum +
                                (entry.textNewRecruits || 0) +
                                (entry.callsToRecruits || 0) +
                                (entry.textInterviews || 0) +
                                (entry.instaDMs || 0) +
                                (entry.initialInterviews || 0),
                              0
                            ) || 0),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
