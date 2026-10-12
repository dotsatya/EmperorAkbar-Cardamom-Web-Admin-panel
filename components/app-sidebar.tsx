"use client"

import * as React from "react"
import Image from "next/image"
import { Photos } from "@/data/websiteData"
import { NavMain, NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  UtensilsCrossed,
  FileText,
  Sparkles,
  HeartPulse,
  HelpCircle,
  Settings,
  Database,
  ExternalLink,
} from "lucide-react"
import ThemeToggle from "./admin/ThemeToggle/ThemeToggle"

export type AdminTab =
  | "dashboard"
  | "products"
  | "orders"
  | "recipes"
  | "blogs"
  | "grading"
  | "health"
  | "faqs"
  | "settings"
  | "backup"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentTab?: AdminTab
  onSelectTab?: (tab: AdminTab) => void
  ordersCount?: number
  productsCount?: number
  onLogout?: () => void
}

export function AppSidebar({
  currentTab = "dashboard",
  onSelectTab,
  ordersCount = 0,
  productsCount = 0,
  onLogout,
  ...props
}: AppSidebarProps) {
  const handleTabClick = (tab: AdminTab) => {
    onSelectTab?.(tab)
  }

  // 1. Catalog & Operations items
  const mainNavItems: NavMainItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      isActive: currentTab === "dashboard",
      onClick: () => handleTabClick("dashboard"),
    },
    {
      id: "products",
      title: "Products & Pricing",
      icon: ShoppingBag,
      isActive: currentTab === "products",
      badge: productsCount > 0 ? productsCount : null,
      onClick: () => handleTabClick("products"),
    },
    {
      id: "orders",
      title: "Customer Orders",
      icon: Package,
      isActive: currentTab === "orders",
      // badge: ordersCount > 0 ? `${ordersCount} new` : null,
      // badgeColor: "bg-[#d4af37] text-stone-900 font-bold",
      onClick: () => handleTabClick("orders"),
    },
    {
      id: "recipes",
      title: "Recipes CMS",
      icon: UtensilsCrossed,
      isActive: currentTab === "recipes",
      onClick: () => handleTabClick("recipes"),
    },
    {
      id: "blogs",
      title: "Articles & News",
      icon: FileText,
      isActive: currentTab === "blogs",
      onClick: () => handleTabClick("blogs"),
    },
  ]

  // 2. Content & Experience items
  const brandNavItems = [
    {
      id: "grading" as AdminTab,
      title: "Grading Visualizer",
      icon: Sparkles,
      isActive: currentTab === "grading",
      onClick: () => handleTabClick("grading"),
    },
    {
      id: "health" as AdminTab,
      title: "Doctor of Spices",
      icon: HeartPulse,
      isActive: currentTab === "health",
      onClick: () => handleTabClick("health"),
    },
    {
      id: "faqs" as AdminTab,
      title: "FAQ Knowledge Base",
      icon: HelpCircle,
      isActive: currentTab === "faqs",
      onClick: () => handleTabClick("faqs"),
    },
  ]

  // 3. System & Settings items
  const systemNavItems = [
    {
      id: "settings" as AdminTab,
      title: "Site & Hero Settings",
      icon: Settings,
      isActive: currentTab === "settings",
      onClick: () => handleTabClick("settings"),
    },
    {
      id: "backup" as AdminTab,
      title: "Backup & Restore",
      icon: Database,
      isActive: currentTab === "backup",
      badge: "JSON",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      onClick: () => handleTabClick("backup"),
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors duration-200"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Emperor Akbar Admin"
              onClick={() => handleTabClick("dashboard")}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-white text-primary-foreground border border-primary/20 p-1 shrink-0 shadow-sm">
                <Image
                  src={Photos.logo}
                  alt="Emperor Akbar Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-sidebar-foreground text-sm tracking-wide truncate">
                  Emperor Akbar
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#b89528] dark:text-[#d4af37] font-semibold truncate">
                  Admin Suite
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="scrollbar-thin">
        {/* Operations & Catalog */}
        <NavMain
          label="Operations & Catalog"
          items={mainNavItems}
        />

        {/* Brand Experience Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 pt-1 group-data-[collapsible=icon]:hidden">
            Brand Experience
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brandNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                      onClick={item.onClick}
                      className={`h-9 px-2.5 transition-all text-xs font-semibold rounded-lg ${
                        item.isActive
                          ? "bg-primary text-primary-foreground dark:bg-[#072d11] dark:text-[#d4af37] dark:border dark:border-[#d4af37]/40 shadow-sm"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${
                          item.isActive ? "text-primary-foreground dark:text-[#d4af37]" : "text-muted-foreground"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Configuration Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 pt-1 group-data-[collapsible=icon]:hidden">
            System & Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                      onClick={item.onClick}
                      className={`h-9 px-2.5 transition-all text-xs font-semibold rounded-lg ${
                        item.isActive
                          ? "bg-primary text-primary-foreground dark:bg-[#072d11] dark:text-[#d4af37] dark:border dark:border-[#d4af37]/40 shadow-sm"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${
                          item.isActive ? "text-primary-foreground dark:text-[#d4af37]" : "text-muted-foreground"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>

                    {item.badge && (
                      <SidebarMenuBadge
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                          item.badgeColor ||
                          "bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300 border border-border"
                        }`}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer with Profile & Logout */}
      <SidebarFooter className="border-t border-sidebar-border p-2">

        <NavUser
          user={{
            name: "Akbar Admin",
            email: "admin@emperorakbar.com",
            role: "Master Access",
          }}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
export default AppSidebar
