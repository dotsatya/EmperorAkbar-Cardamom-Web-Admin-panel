/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { AdminProduct } from "@/lib/adminStore";

interface ProductsViewProps {
  products: AdminProduct[];
  onSaveProducts: (updated: AdminProduct[]) => void;
  openCreateModalDirectly?: boolean;
}

export default function ProductsView({
  products,
  onSaveProducts,
  openCreateModalDirectly = false,
}: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isCreating, setIsCreating] = useState(openCreateModalDirectly);

  // Form State for Editing/Creating
  const [formState, setFormState] = useState<Partial<AdminProduct>>({
    id: "",
    name: "",
    price: 1999,
    originalPrice: 2999,
    weights: ["50g", "100g", "250g", "500g"],
    weight: "100g",
    image: "",
    tag: "Sale",
    grade: "8mm & Above",
    inStock: true,
    description: "",
    notes: "",
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      filterTag === "all" ||
      (filterTag === "inStock" && p.inStock) ||
      (filterTag === "soldOut" && !p.inStock) ||
      p.tag?.toLowerCase() === filterTag.toLowerCase();
    return matchesSearch && matchesTag;
  });

  const handleOpenEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormState({ ...product });
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setFormState({
      id: `grade-${Date.now()}`,
      name: "",
      price: 1999,
      originalPrice: 2999,
      weights: ["50g", "100g", "250g", "500g"],
      weight: "100g",
      image: "https://www.emperorakbar.com/cdn/shop/files/EAC_Website_Home_PurpleGrade_020126_900x.jpg",
      tag: "Sale",
      grade: "Alleppey GI-Tagged",
      inStock: true,
      description: "Authentic, freshly harvested aromatic Alleppey green cardamom pods with high essential oil retention.",
      notes: "Packed in Aroma-Lock sealed pouches.",
    });
    setEditingProduct(null);
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;

    if (isCreating) {
      const newProduct: AdminProduct = {
        ...(formState as AdminProduct),
        id: formState.id || `grade-${Date.now()}`,
        price: Number(formState.price) || 0,
        originalPrice: Number(formState.originalPrice) || 0,
        weights: formState.weights || ["100g"],
      };
      onSaveProducts([...products, newProduct]);
    } else if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({
              ...p,
              ...formState,
              price: Number(formState.price) || 0,
              originalPrice: Number(formState.originalPrice) || 0,
            } as AdminProduct)
          : p
      );
      onSaveProducts(updated);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm text-card-foreground">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary dark:text-[#d4af37]" />
            Cardamom Products & Pricing
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage grades, pricing, weights, image assets, and live inventory status
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, grade or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Items" },
            { id: "inStock", label: "In Stock" },
            { id: "soldOut", label: "Sold Out" },
            { id: "sale", label: "On Sale" },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTag === tag.id
                  ? "bg-primary text-primary-foreground dark:bg-[#072d11] dark:text-[#d4af37] font-bold shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => {
          const isSoldOut = !product.inStock || product.tag === "Sold Out";
          return (
            <div
              key={product.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm relative flex flex-col justify-between hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all group text-card-foreground"
            >
              <div>
                {/* Header / Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isSoldOut
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : product.tag || "In Stock"}
                    </span>
                    {product.grade && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {product.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="w-8 h-8 rounded-lg bg-muted/60 hover:bg-muted text-foreground border border-border transition-colors flex items-center justify-center cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground border border-destructive/20 transition-colors flex items-center justify-center cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product Image & Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl bg-muted/40 border border-border p-2 shrink-0 relative overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground leading-tight mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Available Weights */}
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
                    Available Variants:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(product.weights || ["100g"]).map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 rounded-md bg-muted/60 border border-border text-[10px] font-mono text-muted-foreground"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Quick Edit CTA */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold font-sans text-primary dark:text-[#d4af37]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Default: {product.weight || "100g"}</span>
                </div>

                <button
                  onClick={() => handleOpenEdit(product)}
                  className="px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground border border-border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-primary dark:text-[#d4af37]" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary dark:text-[#d4af37]" />
                {isCreating ? "Add New Cardamom Grade Product" : `Edit Product: ${editingProduct?.name}`}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name || ""}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Purple Grade Cardamom"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Pod Grade / Diameter Spec</label>
                  <input
                    type="text"
                    value={formState.grade || ""}
                    onChange={(e) => setFormState({ ...formState, grade: e.target.value })}
                    placeholder="e.g. 8mm & Above"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formState.price ?? ""}
                    onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Original / MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formState.originalPrice ?? ""}
                    onChange={(e) => setFormState({ ...formState, originalPrice: Number(e.target.value) })}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Badge Tag</label>
                  <select
                    value={formState.tag || "Sale"}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        tag: e.target.value,
                        inStock: e.target.value !== "Sold Out",
                      })
                    }
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Chef's Choice">Chef&apos;s Choice</option>
                    <option value="GI Certified">GI Certified</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Inventory Status</label>
                  <select
                    value={formState.inStock ? "inStock" : "soldOut"}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        inStock: e.target.value === "inStock",
                        tag: e.target.value === "soldOut" ? "Sold Out" : formState.tag,
                      })
                    }
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="inStock">In Stock & Ready to Ship</option>
                    <option value="soldOut">Out of Stock (Sold Out)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Product Image URL</label>
                <input
                  type="text"
                  value={formState.image || ""}
                  onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                  placeholder="https://... or /images/..."
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formState.description || ""}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Available Weights (Comma separated)</label>
                <input
                  type="text"
                  value={(formState.weights || []).join(", ")}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      weights: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="50g, 100g, 250g, 500g"
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-900 font-bold uppercase tracking-wider shadow-lg shadow-black/20 hover:from-[#e5bf45] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
