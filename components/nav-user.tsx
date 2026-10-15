"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { EllipsisVerticalIcon } from "lucide-react";
import ThemeToggle from "@/components/admin/ThemeToggle/ThemeToggle";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
}) {
  const { isMobile } = useSidebar();

  const initials =
    user.name.split(" ").length > 1
      ? user.name.split(" ")[0][0] + user.name.split(" ")[1][0]
      : user.name.slice(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-sidebar-accent hover:bg-sidebar-accent transition-colors"
              />
            }
          >
            <Avatar className="size-8 rounded-xl border border-primary/20 bg-primary/10 text-primary dark:border-[#d4af37]/40 dark:bg-[#173a27] dark:text-[#d4af37]">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary dark:bg-[#173a27] dark:text-[#d4af37] font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground">
                {user.name}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user.role || user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 bg-popover border border-border text-popover-foreground shadow-2xl rounded-xl p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm border-b border-border">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-[#173a27] dark:text-[#d4af37] border border-primary/20 flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-bold text-popover-foreground">
                      {user.name}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {/* Theme Toggle */}
            <div className="px-1 py-1">
              <ThemeToggle showLabel={true} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
