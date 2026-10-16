/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  X,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CardamomProduct,
  cardamomBadgeOptions,
  inventoryStatusOptions,
  availableCardamomWeights,
  CardamomBadge,
  InventoryStatus,
  normalizeCardamomProduct,
  getStaticSrc,
  DEFAULT_GRADE_IMAGES,
} from "@/lib/adminStore";

interface ProductsViewProps {
  products: CardamomProduct[];
  onSaveProducts: (updated: CardamomProduct[]) => void;
  openCreateModalDirectly?: boolean;
}

export default function ProductsView({
  products,
  onSaveProducts,
  openCreateModalDirectly = false,
}: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [editingProduct, setEditingProduct] = useState<CardamomProduct | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(openCreateModalDirectly);

  // Form State for Editing/Creating
  const [formState, setFormState] = useState<Partial<CardamomProduct>>({
    id: "",
    slug: "",
    name: "",
    grade: "Purple",
    diameterSpec: "Purple",
    sellingPrice: 2299,
    originalPrice: 3800,
    badge: "Sale",
    inventoryStatus: "In Stock & Ready to Ship",
    imageUrl: "",
    imageAlt: "",
    description: "",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  });

  const filteredProducts = products.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.id.toLowerCase().includes(searchLower) ||
      (p.grade && p.grade.toLowerCase().includes(searchLower)) ||
      (p.diameterSpec && p.diameterSpec.toLowerCase().includes(searchLower)) ||
      (p.description && p.description.toLowerCase().includes(searchLower));

    const isSoldOut =
      p.inventoryStatus === "Out of Stock (Sold Out)" ||
      !p.inStock ||
      p.badge === "Sold Out" ||
      p.tag === "Sold Out";

    const matchesTag =
      filterTag === "all" ||
      (filterTag === "inStock" && !isSoldOut) ||
      (filterTag === "soldOut" && isSoldOut) ||
      (filterTag === "sale" && (p.badge === "Sale" || p.tag === "Sale")) ||
      p.badge?.toLowerCase() === filterTag.toLowerCase() ||
      p.tag?.toLowerCase() === filterTag.toLowerCase();

    return matchesSearch && matchesTag;
  });

  const totalCount = products.length;
  const inStockCount = products.filter(
    (p) =>
      p.inventoryStatus !== "Out of Stock (Sold Out)" &&
      p.inStock &&
      p.badge !== "Sold Out" &&
      p.tag !== "Sold Out",
  ).length;
  const soldOutCount = products.filter(
    (p) =>
      p.inventoryStatus === "Out of Stock (Sold Out)" ||
      !p.inStock ||
      p.badge === "Sold Out" ||
      p.tag === "Sold Out",
  ).length;
  const saleCount = products.filter(
    (p) => p.badge === "Sale" || p.tag === "Sale",
  ).length;

  const filterOptions = [
    { id: "all", label: "All Items", count: totalCount },
    { id: "inStock", label: "In Stock", count: inStockCount },
    { id: "soldOut", label: "Sold Out", count: soldOutCount },
    { id: "sale", label: "On Sale", count: saleCount },
  ];

  const activeFilter = filterOptions.find((opt) => opt.id === filterTag) || {
    id: filterTag,
    label: filterTag,
    count: filteredProducts.length,
  };

  const handleOpenEdit = (product: CardamomProduct) => {
    const normalized = normalizeCardamomProduct(product);
    setEditingProduct(normalized);
    setFormState({
      ...normalized,
      sellingPrice: normalized.sellingPrice,
      originalPrice: normalized.originalPrice,
      diameterSpec: normalized.diameterSpec || normalized.grade,
      badge: normalized.badge,
      inventoryStatus: normalized.inventoryStatus,
      imageUrl: getStaticSrc(normalized.imageUrl || normalized.image, ""),
      availableWeights: normalized.availableWeights || normalized.weights,
      defaultWeight: normalized.defaultWeight || normalized.weight,
    });
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setFormState({
      id: `cardamom-${Date.now()}`,
      slug: `cardamom-${Date.now()}`,
      name: "",
      grade: "Purple",
      diameterSpec: "Purple",
      sellingPrice: 2299,
      originalPrice: 3800,
      badge: "Sale",
      inventoryStatus: "In Stock & Ready to Ship",
      imageUrl: "",
      imageAlt: "",
      description:
        "Authentic, freshly harvested aromatic Alleppey green cardamom pods.",
      availableWeights: [...availableCardamomWeights],
      defaultWeight: "100 gm",
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

    const sellingPrice = Number(formState.sellingPrice ?? formState.price) || 0;
    const originalPrice = Number(formState.originalPrice) || 0;
    const badge = (formState.badge || formState.tag || "Sale") as CardamomBadge;
    const inventoryStatus = (formState.inventoryStatus ||
      (badge === "Sold Out"
        ? "Out of Stock (Sold Out)"
        : "In Stock & Ready to Ship")) as InventoryStatus;
    const inStock =
      inventoryStatus === "In Stock & Ready to Ship" && badge !== "Sold Out";
    const imageUrl = getStaticSrc(formState.imageUrl || formState.image, "");
    const availableWeights =
      formState.availableWeights && formState.availableWeights.length > 0
        ? formState.availableWeights
        : formState.weights && formState.weights.length > 0
          ? formState.weights
          : [...availableCardamomWeights];
    const defaultWeight =
      formState.defaultWeight ||
      formState.weight ||
      availableWeights[0] ||
      "100 gm";
    const grade = formState.grade || "Purple";
    const diameterSpec = formState.diameterSpec || formState.size || grade;

    const itemToSave = normalizeCardamomProduct({
      ...formState,
      id:
        formState.id ||
        (isCreating ? `cardamom-${Date.now()}` : editingProduct?.id || ""),
      slug: formState.slug || formState.id || `cardamom-${Date.now()}`,
      name: formState.name,
      grade,
      diameterSpec,
      sellingPrice,
      originalPrice,
      badge,
      inventoryStatus,
      imageUrl,
      imageAlt: formState.imageAlt || `${formState.name} cardamom`,
      description: formState.description || "",
      availableWeights,
      defaultWeight,
      inStock,
    });

    if (isCreating) {
      onSaveProducts([...products, itemToSave]);
    } else if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? itemToSave : p,
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
            Manage grades, pricing, weights, image assets, and live inventory
            status
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, grade or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-input rounded-xl pl-10 pr-9 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary dark:focus:border-[#d4af37] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown on Right Side */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`h-[38px] px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-xs shrink-0 select-none ${
              filterTag !== "all"
                ? "bg-primary/10 border-primary/40 text-primary dark:bg-[#072d11] dark:border-[#d4af37]/50 dark:text-[#d4af37]"
                : "bg-card border-input text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter
                className={`w-3.5 h-3.5 ${
                  filterTag !== "all"
                    ? "text-primary dark:text-[#d4af37]"
                    : "text-muted-foreground"
                }`}
              />
              <span>{activeFilter.label}</span>
              {filterTag !== "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#d4af37]" />
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="min-w-48 w-56 p-1.5 rounded-xl border border-border bg-popover shadow-xl text-popover-foreground z-50"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Filter by Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-border" />
              {filterOptions.map((tag) => {
                const isSelected = filterTag === tag.id;
                return (
                  <DropdownMenuItem
                    key={tag.id}
                    onClick={() => setFilterTag(tag.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary dark:bg-[#072d11] dark:text-[#d4af37] font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tag.id === "inStock"
                            ? "bg-emerald-500"
                            : tag.id === "soldOut"
                              ? "bg-rose-500"
                              : tag.id === "sale"
                                ? "bg-amber-500"
                                : "bg-muted-foreground"
                        }`}
                      />
                      <span>{tag.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {tag.count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary dark:text-[#d4af37]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            {filterTag !== "all" && (
              <>
                <DropdownMenuSeparator className="my-1 border-border" />
                <DropdownMenuItem
                  onClick={() => setFilterTag("all")}
                  className="flex items-center justify-center py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
                >
                  Reset to All Items
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => {
          const isSoldOut =
            product.inventoryStatus === "Out of Stock (Sold Out)" ||
            !product.inStock ||
            product.badge === "Sold Out" ||
            product.tag === "Sold Out";
          const displayPrice = product.sellingPrice ?? product.price ?? 0;
          const displayOriginalPrice = product.originalPrice;
          const badgeText = isSoldOut
            ? "Sold Out"
            : product.badge || product.tag || "In Stock";
          const gradeText = product.diameterSpec || product.grade;
          const imageSrc = getStaticSrc(product.imageUrl || product.image, "");

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
                      {badgeText}
                    </span>
                    {gradeText && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {gradeText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90">
                    <button
                      onClick={() =>
                        handleDeleteProduct(product.id, product.name)
                      }
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
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.imageAlt || product.name}
                        onError={(e) => {
                          const fb =
                            DEFAULT_GRADE_IMAGES[product.id] ||
                            DEFAULT_GRADE_IMAGES["purple-grade"];
                          if (fb && !e.currentTarget.src.includes(fb)) {
                            e.currentTarget.src = fb;
                          }
                        }}
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
                    {(
                      product.availableWeights ||
                      product.weights || ["100 gm"]
                    ).map((w) => (
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
                      ₹{displayPrice}
                    </span>
                    {displayOriginalPrice &&
                      displayOriginalPrice > displayPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{displayOriginalPrice}
                        </span>
                      )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Default:{" "}
                    {product.defaultWeight || product.weight || "100 gm"}
                  </span>
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
          <div className="bg-white dark:bg-[#18181b] border border-[#e8e2d5] dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-[#ece6d9] dark:border-stone-800 mb-6">
              <h3 className="text-lg font-bold font-sans text-stone-900 dark:text-stone-100 flex items-center gap-2">
                {isCreating
                  ? "Add New Cardamom Grade Product"
                  : `Edit Product: ${editingProduct?.name}`}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-[#f4efe6] dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveForm}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Purple Grade (8 mm & above) Cardamom"
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Pod Grade / Diameter Spec
                  </label>
                  <input
                    type="text"
                    value={formState.diameterSpec ?? formState.grade ?? ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        diameterSpec: e.target.value,
                        grade: e.target.value,
                      })
                    }
                    placeholder="Purple"
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.sellingPrice ?? formState.price ?? ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        sellingPrice: Number(e.target.value),
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Original / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formState.originalPrice ?? ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Badge Tag
                  </label>
                  <select
                    value={formState.badge || formState.tag || "Sale"}
                    onChange={(e) => {
                      const badge = e.target.value as CardamomBadge;
                      setFormState({
                        ...formState,
                        badge,
                        tag: badge,
                        inventoryStatus:
                          badge === "Sold Out"
                            ? "Out of Stock (Sold Out)"
                            : formState.inventoryStatus,
                        inStock: badge !== "Sold Out",
                      });
                    }}
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
                  >
                    {cardamomBadgeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                    Inventory Status
                  </label>
                  <select
                    value={
                      formState.inventoryStatus ||
                      (formState.inStock === false
                        ? "Out of Stock (Sold Out)"
                        : "In Stock & Ready to Ship")
                    }
                    onChange={(e) => {
                      const status = e.target.value as InventoryStatus;
                      setFormState({
                        ...formState,
                        inventoryStatus: status,
                        inStock: status === "In Stock & Ready to Ship",
                        badge:
                          status === "Out of Stock (Sold Out)"
                            ? "Sold Out"
                            : formState.badge === "Sold Out"
                              ? "Sale"
                              : formState.badge,
                        tag:
                          status === "Out of Stock (Sold Out)"
                            ? "Sold Out"
                            : formState.tag === "Sold Out"
                              ? "Sale"
                              : formState.tag,
                      });
                    }}
                    className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
                  >
                    {inventoryStatusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={getStaticSrc(
                    formState.imageUrl || formState.image,
                    "",
                  )}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      imageUrl: e.target.value,
                      image: e.target.value,
                    })
                  }
                  placeholder="/images/cardamom/... or https://..."
                  className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>

              <div>
                <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formState.description || ""}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="Versatile spice, chef recommended, ideal for the discerning home consumer"
                  className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl p-4 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37] transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-stone-900 dark:text-stone-100 font-semibold mb-2 text-xs sm:text-sm">
                  Available Weights (Comma separated)
                </label>
                <input
                  type="text"
                  value={(
                    formState.availableWeights ||
                    formState.weights ||
                    []
                  ).join(", ")}
                  onChange={(e) => {
                    const parsedWeights = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setFormState({
                      ...formState,
                      availableWeights: parsedWeights,
                      weights: parsedWeights,
                    });
                  }}
                  placeholder="100 gm, 250 gm, 500 gm, 1 kg, 5 kg"
                  className="w-full bg-[#f4efe6] dark:bg-stone-900/60 border border-[#e4ded3] dark:border-stone-800 rounded-2xl px-4 py-2.5 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>

              <div className="pt-4 border-t border-[#ece6d9] dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-2xl bg-[#ece8df] dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-[#e2ded5] dark:hover:bg-stone-700 border border-[#ded8cc]/70 dark:border-stone-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#c59a27] hover:bg-[#d8a82b] text-stone-950 font-bold uppercase tracking-wider text-xs shadow-md shadow-black/10 transition-all active:scale-95 cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
