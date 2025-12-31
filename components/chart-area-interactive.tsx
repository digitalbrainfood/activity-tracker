"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Employee activity chart"

const chartData = [
  { date: "2025-12-01", calls: 45, messages: 120, social: 23 },
  { date: "2025-12-02", calls: 52, messages: 98, social: 31 },
  { date: "2025-12-03", calls: 38, messages: 142, social: 18 },
  { date: "2025-12-04", calls: 61, messages: 156, social: 42 },
  { date: "2025-12-05", calls: 55, messages: 134, social: 29 },
  { date: "2025-12-06", calls: 28, messages: 67, social: 15 },
  { date: "2025-12-07", calls: 22, messages: 45, social: 12 },
  { date: "2025-12-08", calls: 48, messages: 128, social: 35 },
  { date: "2025-12-09", calls: 59, messages: 147, social: 28 },
  { date: "2025-12-10", calls: 43, messages: 112, social: 41 },
  { date: "2025-12-11", calls: 67, messages: 168, social: 33 },
  { date: "2025-12-12", calls: 54, messages: 139, social: 26 },
  { date: "2025-12-13", calls: 31, messages: 78, social: 19 },
  { date: "2025-12-14", calls: 25, messages: 52, social: 14 },
  { date: "2025-12-15", calls: 51, messages: 131, social: 37 },
  { date: "2025-12-16", calls: 63, messages: 159, social: 44 },
  { date: "2025-12-17", calls: 47, messages: 118, social: 29 },
  { date: "2025-12-18", calls: 72, messages: 183, social: 51 },
  { date: "2025-12-19", calls: 58, messages: 145, social: 38 },
  { date: "2025-12-20", calls: 34, messages: 89, social: 21 },
  { date: "2025-12-21", calls: 27, messages: 61, social: 16 },
  { date: "2025-12-22", calls: 49, messages: 124, social: 32 },
  { date: "2025-12-23", calls: 56, messages: 152, social: 39 },
  { date: "2025-12-24", calls: 41, messages: 108, social: 24 },
  { date: "2025-12-25", calls: 18, messages: 42, social: 11 },
]

const chartConfig = {
  activity: {
    label: "Activity",
  },
  calls: {
    label: "Calls",
    color: "hsl(var(--chart-1))",
  },
  messages: {
    label: "Messages",
    color: "hsl(var(--chart-2))",
  },
  social: {
    label: "Social",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-12-25")
    let daysToSubtract = 30
    if (timeRange === "14d") {
      daysToSubtract = 14
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Communication activity for the selected period
          </span>
          <span className="@[540px]/card:hidden">Activity trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="14d">Last 14 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Last 14 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-calls)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-calls)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-messages)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-messages)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSocial" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-social)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-social)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="social"
              type="natural"
              fill="url(#fillSocial)"
              stroke="var(--color-social)"
              stackId="a"
            />
            <Area
              dataKey="messages"
              type="natural"
              fill="url(#fillMessages)"
              stroke="var(--color-messages)"
              stackId="a"
            />
            <Area
              dataKey="calls"
              type="natural"
              fill="url(#fillCalls)"
              stroke="var(--color-calls)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
