"use client"

import * as React from "react"
import {
  IconChartBar,
  IconClipboardList,
  IconDashboard,
  IconHeadset,
  IconMessage,
  IconPhone,
  IconPhoneCall,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Activity Tally",
      url: "/dashboard/tally",
      icon: IconClipboardList,
    },
    {
      title: "Call Logs",
      url: "/dashboard/call-logs",
      icon: IconPhoneCall,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: IconUsers,
    },
  ],
  documents: [
    {
      name: "Voice Calls",
      url: "/dashboard/voice-calls",
      icon: IconPhone,
    },
    {
      name: "Messages",
      url: "/dashboard/messages",
      icon: IconMessage,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconHeadset className="!size-5" />
                <span className="text-base font-semibold">Activity Tracker</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
