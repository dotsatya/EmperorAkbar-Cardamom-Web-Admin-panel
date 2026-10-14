"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  Eye,
  User,
  MapPin,
  Phone,
  Mail,
  Printer,
  X,
  CreditCard,
} from "lucide-react";
import { UserOrder } from "@/lib/adminStore";

interface OrdersViewProps {
  orders: UserOrder[];
  onSaveOrders: (updated: UserOrder[]) => void;
}

export default function OrdersView({ orders, onSaveOrders }: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search) ||
      order.customer.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (
    orderId: string,
    newStatus: UserOrder["status"]
  ) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    onSaveOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status: UserOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "Shipped":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-[#d4af37]" />
            Customer Orders
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Live customer transactions, order status tracking, and printable invoices
          </p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground">
          Total Orders: <span className="text-foreground font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap cursor-pointer ${
                statusFilter.toLowerCase() === status.toLowerCase()
                  ? "bg-[#d4af37] text-stone-900 font-bold shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground text-sm font-semibold">No orders matched</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or status filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-bold tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{order.customer.name}</div>
                      <div className="text-[11px] text-muted-foreground">{order.customer.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      <span className="line-clamp-1 max-w-[220px]">
                        {order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-stone-900 hover:bg-[#e5bf45] transition-colors inline-flex items-center gap-1.5 font-bold text-[11px] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Order Details</span>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <span>{selectedOrder.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Placed on {new Date(selectedOrder.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-muted text-foreground border border-border hover:bg-accent flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-lg bg-muted text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Changer */}
            <div className="bg-muted border border-border rounded-2xl p-4 mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                Update Order Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedOrder.status === s
                        ? "bg-[#d4af37] text-stone-900 shadow-sm"
                        : "bg-card border border-border text-foreground hover:bg-card/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-muted p-4 rounded-2xl border border-border">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#d4af37]" /> Customer Info
                </h4>
                <p className="font-semibold text-foreground">{selectedOrder.customer.name}</p>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="w-3 h-3" /> {selectedOrder.customer.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Phone className="w-3 h-3" /> {selectedOrder.customer.phone}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-2xl border border-border">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Shipping Destination
                </h4>
                <p className="text-foreground">{selectedOrder.customer.address}</p>
                <p className="text-muted-foreground mt-0.5">
                  {selectedOrder.customer.city} - {selectedOrder.customer.pincode}
                </p>
                <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="w-3 h-3 text-[#d4af37]" />
                  <span>Paid via: {selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-muted rounded-2xl p-4 border border-border mb-6 text-xs">
              <h4 className="font-bold text-foreground mb-3">Order Items</h4>
              <div className="space-y-2.5">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div>
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Variant: {item.weight} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-foreground">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-sm">
                <span className="font-bold text-foreground">Total Order Amount</span>
                <span className="font-bold text-lg text-[#d4af37]">
                  ₹{selectedOrder.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
