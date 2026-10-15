"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar, AdminTab } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardView from "@/components/admin/views/DashboardView";
import ProductsView from "@/components/admin/views/ProductsView";
import OrdersView from "@/components/admin/views/OrdersView";
import RecipesView from "@/components/admin/views/RecipesView";
import BlogsView from "@/components/admin/views/BlogsView";
import GradingView, { GradeItem } from "@/components/admin/views/GradingView";
import HealthView, { HealthTopic } from "@/components/admin/views/HealthView";
import FaqsView, { FAQCategory } from "@/components/admin/views/FaqsView";
import SettingsView from "@/components/admin/views/SettingsView";
import {
  loadCMSData,
  saveCMSData,
  loadOrders,
  saveOrders,
  resetCMSData,
  WebsiteCMSData,
  UserOrder,
  AdminProduct,
  SiteSettings,
} from "@/lib/adminStore";

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<AdminTab>("dashboard");

  // Quick Action Modal flags
  const [openCreateProduct, setOpenCreateProduct] = useState(false);

  // CMS & Orders Data
  const [cmsData, setCmsData] = useState<WebsiteCMSData>(() => loadCMSData());
  const [orders, setOrders] = useState<UserOrder[]>(() => loadOrders());

  useEffect(() => {
    //eslint-disable-next-line
    setIsMounted(true);
    setCmsData(loadCMSData());
    setOrders(loadOrders());

    const handleCmsUpdate = () => {
      setCmsData(loadCMSData());
    };
    const handleOrdersUpdate = () => {
      setOrders(loadOrders());
    };

    window.addEventListener("emperorakbar-cms-updated", handleCmsUpdate);
    window.addEventListener("emperorakbar-orders-updated", handleOrdersUpdate);

    return () => {
      window.removeEventListener("emperorakbar-cms-updated", handleCmsUpdate);
      window.removeEventListener("emperorakbar-orders-updated", handleOrdersUpdate);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-sans font-medium text-lg transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Initializing Emperor Akbar Suite...
          </span>
        </div>
      </div>
    );
  }

  // Data updater handlers
  const handleSaveProducts = (updatedProducts: AdminProduct[]) => {
    const updated = { ...cmsData, products: updatedProducts };
    setCmsData(updated);
    saveCMSData(updated);
    setOpenCreateProduct(false);
  };

  const handleSaveGrading = (updatedGrading: GradeItem[]) => {
    const updated = { ...cmsData, grading: updatedGrading };
    setCmsData(updated);
    saveCMSData(updated);
  };

  const handleSaveHealth = (updatedHealth: HealthTopic[]) => {
    const updated = { ...cmsData, healthTopics: updatedHealth };
    setCmsData(updated);
    saveCMSData(updated);
  };

  const handleSaveFaqs = (updatedFaqs: FAQCategory[]) => {
    const updated = { ...cmsData, faqs: updatedFaqs };
    setCmsData(updated);
    saveCMSData(updated);
  };

  const handleSaveSettings = (updatedSettings: SiteSettings) => {
    const updated = { ...cmsData, settings: updatedSettings };
    setCmsData(updated);
    saveCMSData(updated);
  };

  const handleSaveOrders = (updatedOrders: UserOrder[]) => {
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const handleRestoreData = (restored: WebsiteCMSData) => {
    setCmsData(restored);
    saveCMSData(restored);
  };

  const handleResetData = () => {
    const defaults = resetCMSData();
    setCmsData(defaults);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      {/* Shadcn AppSidebar with Emperor Akbar Navigation & Badges */}
      <AppSidebar
        variant="sidebar"
        collapsible="icon"
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setOpenCreateProduct(false);
        }}
        ordersCount={orders.filter((o) => o.status === "Pending").length}
        productsCount={cmsData.products.length}
      />

      {/* Main Panel Inset */}
      <SidebarInset className="bg-background text-foreground min-h-screen flex flex-col transition-colors duration-200">
        {/* Dynamic Header with Breadcrumbs & Actions */}
        <SiteHeader currentTab={currentTab} />

        {/* Content Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === "dashboard" && (
              <DashboardView
                data={cmsData}
                orders={orders}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenAddProduct={() => {
                  setCurrentTab("products");
                  setOpenCreateProduct(true);
                }}
                onOpenAddRecipe={() => {
                  setCurrentTab("recipes");
                }}
              />
            )}

            {currentTab === "products" && (
              <ProductsView
                products={cmsData.products}
                onSaveProducts={handleSaveProducts}
                openCreateModalDirectly={openCreateProduct}
              />
            )}

            {currentTab === "orders" && (
              <OrdersView orders={orders} onSaveOrders={handleSaveOrders} />
            )}

            {currentTab === "recipes" && (
              <RecipesView onNavigateTab={(tab) => setCurrentTab(tab as AdminTab)} />
            )}

            {currentTab === "blogs" && (
              <BlogsView onNavigateTab={(tab) => setCurrentTab(tab as AdminTab)} />
            )}

            {currentTab === "grading" && (
              <GradingView
                grading={cmsData.grading}
                onSaveGrading={handleSaveGrading}
              />
            )}

            {currentTab === "health" && (
              <HealthView
                healthTopics={cmsData.healthTopics}
                onSaveHealthTopics={handleSaveHealth}
              />
            )}

            {currentTab === "faqs" && (
              <FaqsView faqs={cmsData.faqs} onSaveFaqs={handleSaveFaqs} />
            )}

            {currentTab === "settings" && (
              <SettingsView
                settings={cmsData.settings}
                onSaveSettings={handleSaveSettings}
              />
            )}

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
