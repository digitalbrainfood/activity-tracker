import { IconTrendingDown, IconTrendingUp, IconPhone, IconMessage, IconBrandFacebook, IconClock } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  callCount?: number
  messageCount?: number
  isConnected?: boolean
}

export function SectionCards({ callCount, messageCount, isConnected }: SectionCardsProps) {
  // Use real data if connected, otherwise show placeholder data
  const totalCalls = isConnected && callCount !== undefined ? callCount : 1247
  const totalMessages = isConnected && messageCount !== undefined ? messageCount : 3892

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconPhone className="size-4" />
            Total Calls
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCalls.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +18.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            842 outbound, 405 inbound <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            vs. 1,055 calls last week
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconMessage className="size-4" />
            SMS/Text Messages
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalMessages.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +24.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            2,341 sent, 1,551 received <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            vs. 3,126 messages last week
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBrandFacebook className="size-4" />
            Social Media
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            567
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -8.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Facebook, WhatsApp, Instagram <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            vs. 618 interactions last week
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconClock className="size-4" />
            Avg. Talk Time
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4m 32s
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total: 94.2 hours this week <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            vs. 4m 02s avg. last week
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
