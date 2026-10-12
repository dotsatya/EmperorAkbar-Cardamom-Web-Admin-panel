"use client";

import React from "react";
import { AppSidebar, AdminTab } from "@/components/app-sidebar";

export type { AdminTab };

export interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  ordersCount: number;
  productsCount: number;
  onOpenAddProduct?: () => void;
  onOpenAddRecipe?: () => void;
  onOpenAddBlog?: () => void;
  onLogout?: () => void;
}

export default function AdminSidebar(props: AdminSidebarProps) {
  return (
    <AppSidebar
      currentTab={props.currentTab}
      onSelectTab={props.onSelectTab}
      ordersCount={props.ordersCount}
      productsCount={props.productsCount}
      onLogout={props.onLogout}
    />
  );
}

export { AppSidebar };
