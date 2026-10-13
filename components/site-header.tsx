"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { AdminTab } from "@/components/app-sidebar"

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: "Dashboard Overview",
  products: "Products & Pricing",
  orders: "Customer Orders",
  recipes: "Recipes CMS",
  blogs: "Articles & News",
  grading: "Grading Visualizer",
  health: "Doctor of Spices",
  faqs: "FAQ Knowledge Base",
  settings: "Admin Settings",
}

export interface SiteHeaderProps {
  currentTab?: AdminTab
  ordersCount?: number
  onLogout?: () => void
}

export function SiteHeader({
  currentTab = "dashboard",
}: SiteHeaderProps) {
  const currentTitle = TAB_TITLES[currentTab] || "Admin Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30 transition-colors duration-200">
      {/* Left: Sidebar trigger, separator, breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 bg-border"
        />
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <span className="text-muted-foreground font-medium">Emperor Akbar</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex text-muted-foreground/50" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground tracking-wide">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

    </header>
  )
}
export default SiteHeader
