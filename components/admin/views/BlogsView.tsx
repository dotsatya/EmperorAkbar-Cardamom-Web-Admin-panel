/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Eye,
  X,
  Plus,
  Pencil,
  Check,
  Filter,
  ChevronDown,
  Trash2,
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
import { websiteData } from "@/data/websiteData";

export interface BlogSection {
  id?: string;
  heading?: string;
  title?: string;
  paragraphs?: string[];
  image?: unknown;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  url?: string;
  image?: unknown;
  youtubeUrl?: string;
  tags?: string[];
  author?: string;
  category?: string;
  content?: {
    introduction?: string[];
    sections?: BlogSection[];
  };
}

interface BlogsViewProps {
  onNavigateTab?: (tab: string) => void;
}

export default function BlogsView({}: BlogsViewProps) {
  const initialBlogs = (websiteData.blogs.items || []) as BlogItem[];
  const [blogsList, setBlogsList] = useState<BlogItem[]>(initialBlogs);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);

  const [newArticleForm, setNewArticleForm] = useState({
    title: "",
    author: "Emperor Akbar Editorial",
    category: "Market Insights",
    tags: "cardamom, spice, harvest",
    image: "",
    description: "",
    introductionText: "",
    sectionHeading: "",
    sectionContentText: "",
  });

  const [editBlogForm, setEditBlogForm] = useState({
    title: "",
    author: "Emperor Akbar Editorial",
    category: "Market Insights",
    tags: "cardamom, spice, harvest",
    image: "",
    description: "",
    introductionText: "",
    sectionHeading: "",
    sectionContentText: "",
  });

  const [categoryFilter, setCategoryFilter] = useState("all");

  const blogCategories = [
    { id: "all", label: "All Categories", count: blogsList.length },
    {
      id: "market",
      label: "Market Insights",
      count: blogsList.filter(
        (b) =>
          b.category?.toLowerCase().includes("market") ||
          b.title.toLowerCase().includes("market") ||
          b.description.toLowerCase().includes("market") ||
          b.tags?.some((t) => t.toLowerCase().includes("market")),
      ).length,
    },
    {
      id: "harvest",
      label: "Harvest & Grades",
      count: blogsList.filter(
        (b) =>
          b.category?.toLowerCase().includes("harvest") ||
          b.title.toLowerCase().includes("harvest") ||
          b.description.toLowerCase().includes("grade") ||
          b.tags?.some((t) => t.toLowerCase().includes("harvest") || t.toLowerCase().includes("grade")),
      ).length,
    },
    {
      id: "culinary",
      label: "Culinary & Recipes",
      count: blogsList.filter(
        (b) =>
          b.category?.toLowerCase().includes("recipe") ||
          b.title.toLowerCase().includes("recipe") ||
          b.tags?.some((t) => t.toLowerCase().includes("recipe") || t.toLowerCase().includes("culinary")),
      ).length,
    },
    {
      id: "wellness",
      label: "Health & Ayurveda",
      count: blogsList.filter(
        (b) =>
          b.category?.toLowerCase().includes("health") ||
          b.description.toLowerCase().includes("health") ||
          b.tags?.some((t) => t.toLowerCase().includes("health") || t.toLowerCase().includes("ayurved")),
      ).length,
    },
  ];

  const activeCategory =
    blogCategories.find((c) => c.id === categoryFilter) || blogCategories[0];

  const filteredBlogs = blogsList.filter((b) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(searchLower) ||
      b.description.toLowerCase().includes(searchLower) ||
      (b.tags && b.tags.some((t: string) => t.toLowerCase().includes(searchLower))) ||
      (b.author && b.author.toLowerCase().includes(searchLower));

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "market" &&
        (b.category?.toLowerCase().includes("market") ||
          b.title.toLowerCase().includes("market") ||
          b.description.toLowerCase().includes("market") ||
          b.tags?.some((t) => t.toLowerCase().includes("market")))) ||
      (categoryFilter === "harvest" &&
        (b.category?.toLowerCase().includes("harvest") ||
          b.title.toLowerCase().includes("harvest") ||
          b.description.toLowerCase().includes("grade") ||
          b.tags?.some((t) => t.toLowerCase().includes("harvest") || t.toLowerCase().includes("grade")))) ||
      (categoryFilter === "culinary" &&
        (b.category?.toLowerCase().includes("recipe") ||
          b.title.toLowerCase().includes("recipe") ||
          b.tags?.some((t) => t.toLowerCase().includes("recipe") || t.toLowerCase().includes("culinary")))) ||
      (categoryFilter === "wellness" &&
        (b.category?.toLowerCase().includes("health") ||
          b.description.toLowerCase().includes("health") ||
          b.tags?.some((t) => t.toLowerCase().includes("health") || t.toLowerCase().includes("ayurved"))));

    return matchesSearch && matchesCategory;
  });

  const handleDeleteBlog = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setBlogsList((prev) => prev.filter((b) => b.id !== id));
      if (selectedBlog && selectedBlog.id === id) {
        setSelectedBlog(null);
      }
    }
  };

  const getImageSrc = (img: unknown): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object" && img !== null && "src" in img) {
      return (img as { src: string }).src;
    }
    return "";
  };

  const handleAddArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleForm.title.trim()) return;

    const newSlug = newArticleForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const parsedTags = newArticleForm.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const introParagraphs = newArticleForm.introductionText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const sectionParagraphs = newArticleForm.sectionContentText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const newBlog = {
      id: `article-${Date.now()}`,
      title: newArticleForm.title,
      slug: newSlug,
      description:
        newArticleForm.description ||
        `In-depth spice article and insights focusing on premium green cardamom.`,
      url: `/blogs/p/${newSlug}`,
      image: newArticleForm.image || initialBlogs[0]?.image,
      tags: parsedTags.length > 0 ? parsedTags : ["cardamom", "spice"],
      content: {
        introduction:
          introParagraphs.length > 0
            ? introParagraphs
            : [
                newArticleForm.description ||
                  `In-depth spice article and insights focusing on premium green cardamom.`,
              ],
        sections: newArticleForm.sectionHeading
          ? [
              {
                id: `sec-${Date.now()}`,
                heading: newArticleForm.sectionHeading,
                paragraphs:
                  sectionParagraphs.length > 0
                    ? sectionParagraphs
                    : ["Further details and market observations to be updated."],
              },
            ]
          : [],
      },
    };

    setBlogsList([newBlog as unknown as (typeof initialBlogs)[0], ...blogsList]);
    setIsCreating(false);
    setNewArticleForm({
      title: "",
      author: "Emperor Akbar Editorial",
      category: "Market Insights",
      tags: "cardamom, spice, harvest",
      image: "",
      description: "",
      introductionText: "",
      sectionHeading: "",
      sectionContentText: "",
    });
  };

  const handleOpenEdit = (blog: BlogItem) => {
    const rawIntro = blog.content?.introduction?.join("\n\n") || "";
    const firstSection = blog.content?.sections?.[0];
    const rawSectionHeading = firstSection?.heading || "";
    const rawSectionContent = firstSection?.paragraphs?.join("\n\n") || "";

    setEditBlogForm({
      title: blog.title,
      author: "Emperor Akbar Editorial",
      category: "Market Insights",
      tags: blog.tags?.join(", ") || "",
      image: getImageSrc(blog.image),
      description: blog.description || "",
      introductionText: rawIntro,
      sectionHeading: rawSectionHeading,
      sectionContentText: rawSectionContent,
    });
    setEditingBlog(blog);
  };

  const handleUpdateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editBlogForm.title.trim()) return;

    const parsedTags = editBlogForm.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const introParagraphs = editBlogForm.introductionText
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const sectionParagraphs = editBlogForm.sectionContentText
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedBlogs = blogsList.map((b) => {
      if (b.id === editingBlog.id) {
        return {
          ...b,
          title: editBlogForm.title,
          description: editBlogForm.description,
          image: editBlogForm.image || b.image,
          tags: parsedTags.length > 0 ? parsedTags : b.tags,
          content: {
            ...b.content,
            introduction:
              introParagraphs.length > 0 ? introParagraphs : b.content?.introduction,
            sections: editBlogForm.sectionHeading
              ? [
                  {
                    id: b.content?.sections?.[0]?.id || `sec-${Date.now()}`,
                    heading: editBlogForm.sectionHeading,
                    paragraphs:
                      sectionParagraphs.length > 0
                        ? sectionParagraphs
                        : b.content?.sections?.[0]?.paragraphs || [],
                  },
                  ...(b.content?.sections?.slice(1) || []),
                ]
              : b.content?.sections,
          },
        };
      }
      return b;
    });

    setBlogsList(updatedBlogs);
    setEditingBlog(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm text-card-foreground">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary dark:text-[#d4af37]" />
            Add a New Article
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Official website articles, market reports, and guides sourced directly from websiteData.ts
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground hidden sm:inline-block">
            Total Articles: <span className="text-foreground font-bold">{blogsList.length}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by headline, keywords, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-9 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] transition-all"
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

        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`h-[38px] px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-xs shrink-0 select-none ${
              categoryFilter !== "all"
                ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#b89528] dark:text-[#d4af37] font-bold"
                : "bg-card border-border text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter
                className={`w-3.5 h-3.5 ${
                  categoryFilter !== "all"
                    ? "text-[#d4af37]"
                    : "text-muted-foreground"
                }`}
              />
              <span>{activeCategory.label}</span>
              {categoryFilter !== "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
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
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-border" />
              {blogCategories.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                return (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#d4af37]/15 text-stone-900 dark:text-[#d4af37] font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {cat.count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            {categoryFilter !== "all" && (
              <>
                <DropdownMenuSeparator className="my-1 border-border" />
                <DropdownMenuItem
                  onClick={() => setCategoryFilter("all")}
                  className="flex items-center justify-center py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
                >
                  Reset to All Categories
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Articles Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground text-sm font-semibold">No articles matched</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or category filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-bold tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category & Author</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-4">Sections</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBlogs.map((blog) => {
                  const imgSrc = getImageSrc(blog.image);
                  const sectionsCount = blog.content?.sections?.length || 1;
                  const introParagraphs = blog.content?.introduction?.length || 1;

                  return (
                    <tr
                      key={blog.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border shrink-0 relative overflow-hidden flex items-center justify-center">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                              {blog.title}
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[240px] mt-0.5">
                              {blog.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/15 text-[#b89528] dark:text-[#d4af37] border border-[#d4af37]/30">
                            {blog.category || "Editorial"}
                          </span>
                          <span className="text-[10px] text-muted-foreground italic">
                            By {blog.author || "Emperor Akbar Editorial"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono text-muted-foreground truncate block max-w-[150px]">
                          /{blog.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {blog.tags?.slice(0, 2).map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div className="text-foreground font-medium">
                          {sectionsCount} {sectionsCount === 1 ? "Section" : "Sections"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {introParagraphs} Intro {introParagraphs === 1 ? "Paragraph" : "Paragraphs"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBlog(blog)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#d4af37] text-stone-900 hover:bg-[#e5bf45] transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            title="Inspect Article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(blog)}
                            className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground hover:bg-muted/80 hover:border-[#d4af37]/50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                            title="Edit Article"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(blog.id, blog.title)}
                            className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div className="pr-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37]">
                  Article Preview
                </span>
                <h3 className="text-lg font-bold text-foreground leading-snug mt-1">
                  {selectedBlog.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="w-8 h-8 rounded-lg bg-muted text-foreground hover:bg-accent flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Image Banner */}
            {getImageSrc(selectedBlog.image) && (
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 border border-border">
                <img
                  src={getImageSrc(selectedBlog.image)}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedBlog.tags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted border border-border text-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="bg-muted p-4 rounded-2xl border border-border mb-6">
              <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">
                Summary:
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedBlog.description}
              </p>
            </div>

            {/* Content Introduction */}
            {selectedBlog.content?.introduction && (
              <div className="space-y-2 mb-6 text-xs text-muted-foreground leading-relaxed">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Introduction:
                </h4>
                {selectedBlog.content.introduction.map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}

            {/* Content Sections Preview */}
            {selectedBlog.content?.sections && (
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Key Sections:
                </h4>
                {selectedBlog.content.sections.map((sec: { heading?: string; paragraphs?: string[] }, idx: number) => (
                  <div key={idx} className="bg-muted p-4 rounded-xl border border-border text-xs">
                    <h5 className="font-bold text-foreground mb-1.5">{sec.heading}</h5>
                    {sec.paragraphs?.map((p: string, pIdx: number) => (
                      <p key={pIdx} className="text-muted-foreground leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="text-right pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Article Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                Publish a New Article
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddArticleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Harvest 2026: Pricing & Quality Trends"
                  value={newArticleForm.title}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, title: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Author / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Emperor Akbar Editorial"
                    value={newArticleForm.author}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, author: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="cardamom, export, harvest, spice"
                    value={newArticleForm.tags}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, tags: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty to use default high-res cardamom artwork"
                  value={newArticleForm.image}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, image: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Short Summary / Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A concise synopsis of the article for cards and SEO..."
                  value={newArticleForm.description}
                  onChange={(e) =>
                    setNewArticleForm({ ...newArticleForm, description: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Introduction Paragraphs
                </label>
                <textarea
                  rows={3}
                  placeholder="Opening paragraphs explaining the background and context..."
                  value={newArticleForm.introductionText}
                  onChange={(e) =>
                    setNewArticleForm({ ...newArticleForm, introductionText: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Optional Article Section
                </span>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Section Heading</label>
                  <input
                    type="text"
                    placeholder="e.g. 1. Market Drivers & Export Growth"
                    value={newArticleForm.sectionHeading}
                    onChange={(e) =>
                      setNewArticleForm({ ...newArticleForm, sectionHeading: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Section Paragraphs</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed commentary, insights, or findings for this section..."
                    value={newArticleForm.sectionContentText}
                    onChange={(e) =>
                      setNewArticleForm({ ...newArticleForm, sectionContentText: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#d4af37]" />
                Edit Article & Spice Insights
              </h3>
              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                className="w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateArticleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Harvest 2026: Pricing & Quality Trends"
                  value={editBlogForm.title}
                  onChange={(e) => setEditBlogForm({ ...editBlogForm, title: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Author / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Emperor Akbar Editorial"
                    value={editBlogForm.author}
                    onChange={(e) => setEditBlogForm({ ...editBlogForm, author: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="cardamom, export, harvest, spice"
                    value={editBlogForm.tags}
                    onChange={(e) => setEditBlogForm({ ...editBlogForm, tags: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty or enter image URL"
                  value={editBlogForm.image}
                  onChange={(e) => setEditBlogForm({ ...editBlogForm, image: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Short Summary / Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A concise synopsis of the article for cards and SEO..."
                  value={editBlogForm.description}
                  onChange={(e) =>
                    setEditBlogForm({ ...editBlogForm, description: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Introduction Paragraphs
                </label>
                <textarea
                  rows={3}
                  placeholder="Opening paragraphs explaining the background and context..."
                  value={editBlogForm.introductionText}
                  onChange={(e) =>
                    setEditBlogForm({ ...editBlogForm, introductionText: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Optional Article Section
                </span>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Section Heading</label>
                  <input
                    type="text"
                    placeholder="e.g. 1. Market Drivers & Export Growth"
                    value={editBlogForm.sectionHeading}
                    onChange={(e) =>
                      setEditBlogForm({ ...editBlogForm, sectionHeading: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Section Paragraphs</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed commentary, insights, or findings for this section..."
                    value={editBlogForm.sectionContentText}
                    onChange={(e) =>
                      setEditBlogForm({ ...editBlogForm, sectionContentText: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Article Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
