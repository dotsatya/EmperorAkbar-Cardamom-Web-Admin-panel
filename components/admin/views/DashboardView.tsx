"use client";

import React from "react";
import {
  ShoppingBag,
  Package,
  UtensilsCrossed,
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { UserOrder, WebsiteCMSData } from "@/lib/adminStore";
import { AdminTab } from "@/components/app-sidebar";
import { websiteData } from "@/data/websiteData";

interface DashboardViewProps {
  data: WebsiteCMSData;
  orders: UserOrder[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct?: () => void;
  onOpenAddRecipe?: () => void;
}

export default function DashboardView({
  data,
  orders,
  onNavigateTab,
}: DashboardViewProps) {
  const totalRevenue = orders.reduce((sum, o) => (o.status !== "Cancelled" ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const soldOutProducts = data.products.filter((p) => !p.inStock || p.tag === "Sold Out");

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all text-card-foreground">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 text-[#b89528] dark:text-[#d4af37] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active transactions ({orders.length} orders placed)</span>
          </div>
        </div>

        {/* Orders Card */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all cursor-pointer text-card-foreground"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Orders Status</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
            {orders.length}{" "}
            <span className="text-xs text-muted-foreground font-sans font-normal">total</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            {pendingOrders > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {pendingOrders} awaiting fulfillment
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All orders fulfilled
              </span>
            )}
          </div>
        </div>

        {/* Products Card */}
        <div
          onClick={() => onNavigateTab("products")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all cursor-pointer text-card-foreground"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">All type of Grades</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
            {data.products.length}{" "}
            <span className="text-xs text-muted-foreground font-sans font-normal">grades</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            {soldOutProducts.length > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {soldOutProducts.length} grade sold out
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">All items in stock</span>
            )}
          </div>
        </div>

        {/* Content CMS Card */}
        <div
          onClick={() => onNavigateTab("recipes")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all cursor-pointer text-card-foreground"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Recipes</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
            {data.recipes.length + websiteData.blogs.items.length}{" "}
            <span className="text-xs text-muted-foreground font-sans font-normal">posts</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
            <span>{data.recipes.length} Gourmet Recipes</span>
            <span>&bull;</span>
            <span>{websiteData.blogs.items.length} Articles</span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Recent Orders & Quick Launch CMS */}
      <div className="grid grid-cols-1">
        {/* Left: Recent Orders List (2 Cols) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm text-card-foreground">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Recent Customer Orders</h2>
              <p className="text-xs text-muted-foreground">Latest orders placed through your storefront</p>
            </div>
            <button
              onClick={() => onNavigateTab("orders")}
              className="text-xs text-primary dark:text-[#d4af37] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No orders placed yet. Place an order from the cart to test!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order) => {
                    const statusColor =
                      order.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : order.status === "Processing"
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
                        : order.status === "Shipped"
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                        : order.status === "Cancelled"
                        ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";

                    return (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-foreground">{order.orderNumber}</td>
                        <td className="py-3">
                          <p className="font-semibold text-foreground">{order.customer.name}</p>
                          <p className="text-[10px] text-muted-foreground">{order.customer.city}</p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                        </td>
                        <td className="py-3 font-bold text-foreground dark:text-[#d4af37]">₹{order.total.toLocaleString("en-IN")}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

     
      </div>
    </div>
  );
}
