"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface NavMainItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  badge?: React.ReactNode
  badgeColor?: string
  onClick: () => void
}

export function NavMain({
  label = "Catalog & Operations",
  items,
}: {
  label?: string
  items: NavMainItem[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">


        {label && (
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 pt-2">
            {label}
          </SidebarGroupLabel>
        )}

        {/* Navigation Items */}
        <SidebarMenu>
          {items.map((item) => {
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

                {item.badge != null && (
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
  )
}
