/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  UtensilsCrossed,
  Search,
  Eye,
  Clock,
  Users,
  ChefHat,
  X,
  Flame,
  Plus,
  Pencil,
  Check,
  Filter,
  ChevronDown,
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

export interface RecipeIngredient {
  name: string;
  quantity: string;
}

export interface RecipeIngredientGroup {
  id?: string;
  title?: string;
  items?: string[];
  ingredients?: RecipeIngredient[];
}

export interface RecipeStepItem {
  id?: string;
  title?: string;
  description?: string;
  instructions?: string[];
}

export interface RecipeItem {
  id: string;
  title: string;
  slug?: string;
  image?: unknown;
  category?: string;
  cookTime?: string;
  prepTime?: string;
  servings?: string;
  author?: string;
  difficulty?: string;
  description?: string;
  tags?: string[];
  content?: {
    recipeInfo?: {
      preparationTime?: string;
      cookingTime?: string;
      prepTime?: string;
      cookTime?: string;
      servings?: string;
      difficulty?: string;
      cuisine?: string;
      category?: string;
    };
    ingredientGroups?: RecipeIngredientGroup[];
    steps?: (string | RecipeStepItem)[];
    introduction?: string[];
  };
}

interface RecipesViewProps {
  onNavigateTab?: (tab: string) => void;
}

export default function RecipesView({}: RecipesViewProps) {
  // Source collaborative recipes from websiteData.ts with local additions
  const initialRecipes = (websiteData.recipes.items || []) as RecipeItem[];
  const [recipesList, setRecipesList] = useState<RecipeItem[]>(initialRecipes);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeItem | null>(null);

  // New Recipe Form state
  const [newRecipeForm, setNewRecipeForm] = useState({
    title: "",
    author: "Shimi's Kitchen",
    category: "Dessert",
    prepTime: "15 mins",
    cookTime: "30 mins",
    servings: "4 servings",
    difficulty: "Easy",
    image: "",
    description: "",
    ingredientsText: "",
    stepsText: "",
  });

  // Edit Recipe Form state
  const [editRecipeForm, setEditRecipeForm] = useState({
    title: "",
    author: "Shimi's Kitchen",
    category: "Dessert",
    prepTime: "15 mins",
    cookTime: "30 mins",
    servings: "4 servings",
    difficulty: "Easy",
    image: "",
    description: "",
    ingredientsText: "",
    stepsText: "",
  });

  const allTags = ["All", ...(websiteData.recipes.tags?.filter((t) => t !== "All") || [])];

  const tagFilterOptions = allTags.map((tag) => ({
    id: tag,
    label: tag === "All" ? "All Recipes" : `#${tag}`,
    count:
      tag === "All"
        ? recipesList.length
        : recipesList.filter(
            (r) =>
              r.tags &&
              r.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
          ).length,
  }));

  const activeTagFilter =
    tagFilterOptions.find((opt) => opt.id.toLowerCase() === selectedTag.toLowerCase()) ||
    tagFilterOptions[0];

  const filteredRecipes = recipesList.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.tags && r.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesTag =
      selectedTag === "All" || (r.tags && r.tags.includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  const getImageSrc = (img: unknown): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object" && img !== null && "src" in img) {
      return (img as { src: string }).src;
    }
    return "";
  };

  const handleAddRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeForm.title) return;

    const ingredients = newRecipeForm.ingredientsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("-");
        return {
          name: parts[0]?.trim() || line,
          quantity: parts[1]?.trim() || "To taste",
        };
      });

    const steps = newRecipeForm.stepsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => ({
        id: `step-${idx + 1}`,
        title: `Step ${idx + 1}: ${line.slice(0, 30)}...`,
        description: line,
        instructions: [line],
      }));

    const newSlug = newRecipeForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newRecipe = {
      id: `recipe-${Date.now()}`,
      title: newRecipeForm.title,
      slug: `${newSlug}-by-shimis-kitchen`,
      author: newRecipeForm.author || "Shimi's Kitchen",
      description:
        newRecipeForm.description ||
        `A freshly crafted cardamom creation featuring Emperor Akbar Cardamom and ${newRecipeForm.author}.`,
      url: `/blogs/recipes/${newSlug}`,
      image: newRecipeForm.image || initialRecipes[0]?.image,
      tags: [newRecipeForm.category.toLowerCase(), "recipe", "festive recipe"],
      content: {
        introduction: [
          newRecipeForm.description ||
            `A special cardamom recipe crafted in partnership with ${newRecipeForm.author}.`,
        ],
        recipeInfo: {
          cuisine: "Gourmet Indian",
          category: newRecipeForm.category,
          difficulty: newRecipeForm.difficulty,
          servings: newRecipeForm.servings,
          preparationTime: newRecipeForm.prepTime,
          cookingTime: newRecipeForm.cookTime,
        },
        ingredientGroups: [
          {
            id: "main-ingredients",
            title: "Ingredients",
            ingredients:
              ingredients.length > 0
                ? ingredients
                : [
                    { name: "Emperor Akbar Cardamom pods", quantity: "6 pods (crushed)" },
                    { name: "Full cream milk", quantity: "500 ml" },
                    { name: "Sugar", quantity: "4 tbsp" },
                  ],
          },
        ],
        steps:
          steps.length > 0
            ? steps
            : [
                {
                  id: "step-1",
                  title: "1. Prepare Ingredients",
                  description: "Lightly crush the Emperor Akbar cardamom pods to release the essential oils.",
                  instructions: ["Lightly crush the Emperor Akbar cardamom pods."],
                },
                {
                  id: "step-2",
                  title: "2. Simmer & Infuse",
                  description: "Simmer gently until thickened and wonderfully fragrant.",
                  instructions: ["Simmer gently until aromatic."],
                },
              ],
      },
    };

    setRecipesList([newRecipe as unknown as (typeof initialRecipes)[0], ...recipesList]);
    setIsCreating(false);
    setNewRecipeForm({
      title: "",
      author: "Shimi's Kitchen",
      category: "Dessert",
      prepTime: "15 mins",
      cookTime: "30 mins",
      servings: "4 servings",
      difficulty: "Easy",
      image: "",
      description: "",
      ingredientsText: "",
      stepsText: "",
    });
  };

  const handleOpenEdit = (recipe: RecipeItem) => {
    const rawIngs =
      recipe.content?.ingredientGroups
        ?.flatMap((g: RecipeIngredientGroup) => g.ingredients?.map((i: RecipeIngredient) => `${i.name} - ${i.quantity}`) || [])
        .join("\n") || "";

    const rawSteps =
      recipe.content?.steps
        ?.map((s) => (typeof s === "string" ? s : s.description || (Array.isArray(s.instructions) ? s.instructions[0] : null) || s.title || ""))
        .join("\n") || "";

    setEditRecipeForm({
      title: recipe.title,
      author: recipe.author || "Collaborative Chef",
      category: recipe.content?.recipeInfo?.category || "Dessert",
      prepTime: recipe.content?.recipeInfo?.preparationTime || "15 mins",
      cookTime: recipe.content?.recipeInfo?.cookingTime || "30 mins",
      servings: recipe.content?.recipeInfo?.servings || "4 servings",
      difficulty: recipe.content?.recipeInfo?.difficulty || "Easy",
      image: getImageSrc(recipe.image),
      description: recipe.description || "",
      ingredientsText: rawIngs,
      stepsText: rawSteps,
    });
    setEditingRecipe(recipe);
  };

  const handleUpdateRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe || !editRecipeForm.title.trim()) return;

    const ingredients = editRecipeForm.ingredientsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("-");
        return {
          name: parts[0]?.trim() || line,
          quantity: parts[1]?.trim() || "To taste",
        };
      });

    const steps = editRecipeForm.stepsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => ({
        id: `step-${idx + 1}`,
        title: `Step ${idx + 1}: ${line.slice(0, 30)}...`,
        description: line,
        instructions: [line],
      }));

    const updatedRecipes = recipesList.map((r) => {
      if (r.id === editingRecipe.id) {
        return {
          ...r,
          title: editRecipeForm.title,
          author: editRecipeForm.author,
          description: editRecipeForm.description,
          image: editRecipeForm.image || r.image,
          tags: [editRecipeForm.category.toLowerCase(), "recipe", "festive recipe"],
          content: {
            ...r.content,
            introduction: [
              editRecipeForm.description ||
                `A special cardamom recipe crafted in partnership with ${editRecipeForm.author}.`,
            ],
            recipeInfo: {
              ...r.content?.recipeInfo,
              cuisine: r.content?.recipeInfo?.cuisine || "Gourmet Indian",
              category: editRecipeForm.category,
              difficulty: editRecipeForm.difficulty,
              servings: editRecipeForm.servings,
              preparationTime: editRecipeForm.prepTime,
              cookingTime: editRecipeForm.cookTime,
            },
            ingredientGroups: [
              {
                id: "main-ingredients",
                title: "Ingredients",
                ingredients:
                  ingredients.length > 0
                    ? ingredients
                    : r.content?.ingredientGroups?.[0]?.ingredients || [],
              },
            ],
            steps: steps.length > 0 ? steps : r.content?.steps || [],
          },
        };
      }
      return r;
    });

    setRecipesList(updatedRecipes);
    setEditingRecipe(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm text-card-foreground">
         <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary dark:text-[#d4af37]" />
            Add a New Recipe
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Official collaborative recipes from websiteData.ts featuring Emperor Akbar green cardamom
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground hidden sm:inline-block">
            Total: <span className="text-foreground font-bold">{recipesList.length}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search recipes by name, ingredient, or culinary tag..."
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

        {/* Tag / Category Filter Dropdown on Right Side */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`h-[38px] px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-xs shrink-0 select-none ${
              selectedTag !== "All"
                ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#b89528] dark:text-[#d4af37] font-bold"
                : "bg-card border-border text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter
                className={`w-3.5 h-3.5 ${
                  selectedTag !== "All"
                    ? "text-[#d4af37]"
                    : "text-muted-foreground"
                }`}
              />
              <span>{activeTagFilter.label}</span>
              {selectedTag !== "All" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="min-w-48 w-56 max-h-72 overflow-y-auto p-1.5 rounded-xl border border-border bg-popover shadow-xl text-popover-foreground z-50"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-border" />
              {tagFilterOptions.map((tag) => {
                const isSelected =
                  selectedTag.toLowerCase() === tag.id.toLowerCase();
                return (
                  <DropdownMenuItem
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#d4af37]/15 text-stone-900 dark:text-[#d4af37] font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tag.id === "All"
                            ? "bg-muted-foreground"
                            : "bg-[#d4af37]"
                        }`}
                      />
                      <span>{tag.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {tag.count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            {selectedTag !== "All" && (
              <>
                <DropdownMenuSeparator className="my-1 border-border" />
                <DropdownMenuItem
                  onClick={() => setSelectedTag("All")}
                  className="flex items-center justify-center py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
                >
                  Reset to All Recipes
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Recipes Grid: 3 in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.map((recipe) => {
          const imgSrc = getImageSrc(recipe.image);
          const prepTime = recipe.content?.recipeInfo?.preparationTime || "15 mins";
          const cookTime = recipe.content?.recipeInfo?.cookingTime || "30 mins";
          const servings = recipe.content?.recipeInfo?.servings || "4 servings";
          const difficulty = recipe.content?.recipeInfo?.difficulty || "Easy";

          return (
            <div
              key={recipe.id}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-[#d4af37]/40 transition-all text-card-foreground group"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
                {/* Left Side: Tags, Title, Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {recipe.tags?.slice(0, 2).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted border border-border text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-1.5 leading-snug line-clamp-2">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
                    {recipe.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#d4af37]" />
                      {prepTime}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {cookTime}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      {servings}
                    </span>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-muted border border-border overflow-hidden shrink-0 relative">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ChefHat className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    {difficulty}
                  </span>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
                <span className="text-[11px] text-muted-foreground italic truncate max-w-[110px]">
                  By {recipe.author}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(recipe)}
                    className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground hover:bg-muted/80 hover:border-[#d4af37]/50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                    title="Edit Recipe"
                  >
                    <Pencil className="w-3 h-3 text-[#d4af37]" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(recipe)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#d4af37] text-stone-900 hover:bg-[#e5bf45] transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    title="Inspect Recipe"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Recipe Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#d4af37]" />
                Add a New Collaborative Recipe
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecipeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Recipe Title</label>
                  <input
                    type="text"
                    required
                    value={newRecipeForm.title}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, title: e.target.value })}
                    placeholder="e.g. Cardamom Rose Phirni"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Author</label>
                  <input
                    type="text"
                    value={newRecipeForm.author}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, author: e.target.value })}
                    placeholder="Shimi's Kitchen"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Category</label>
                  <input
                    type="text"
                    value={newRecipeForm.category}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, category: e.target.value })}
                    placeholder="Dessert, Beverage, Biryani"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Difficulty</label>
                  <select
                    value={newRecipeForm.difficulty}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, difficulty: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Prep Time</label>
                  <input
                    type="text"
                    value={newRecipeForm.prepTime}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, prepTime: e.target.value })}
                    placeholder="15 mins"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">Cook Time</label>
                  <input
                    type="text"
                    value={newRecipeForm.cookTime}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, cookTime: e.target.value })}
                    placeholder="30 mins"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Description / Intro</label>
                <textarea
                  rows={2}
                  value={newRecipeForm.description}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, description: e.target.value })}
                  placeholder="Describe the aromatic cardamom flavour profile..."
                  className="w-full bg-background border border-input rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Ingredients (Format: Ingredient - Quantity, one per line)
                </label>
                <textarea
                  rows={3}
                  value={newRecipeForm.ingredientsText}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, ingredientsText: e.target.value })}
                  placeholder="Emperor Akbar Cardamom pods - 6 pods&#10;Full cream milk - 500 ml&#10;Sugar - 3 tbsp"
                  className="w-full bg-background border border-input rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Preparation Steps (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newRecipeForm.stepsText}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, stepsText: e.target.value })}
                  placeholder="Crush the cardamom pods to release aromatic seeds.&#10;Bring milk to a simmer and stir continuously.&#10;Serve chilled garnished with saffron."
                  className="w-full bg-background border border-input rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-900 font-bold uppercase tracking-wider shadow-lg shadow-black/20 hover:from-[#e5bf45] transition-all cursor-pointer"
                >
                  Add Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div className="pr-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37] flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  Recipe Inspector (websiteData.ts)
                </span>
                <h3 className="text-lg font-bold text-foreground leading-snug mt-1">
                  {selectedRecipe.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 italic">
                  By {selectedRecipe.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipe Image Banner */}
            {getImageSrc(selectedRecipe.image) && (
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 border border-border relative">
                <img
                  src={getImageSrc(selectedRecipe.image)}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <div className="bg-muted p-2.5 rounded-xl border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Prep Time</p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {selectedRecipe.content?.recipeInfo?.preparationTime || "15 mins"}
                </p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Cook Time</p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {selectedRecipe.content?.recipeInfo?.cookingTime || "30 mins"}
                </p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Servings</p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {selectedRecipe.content?.recipeInfo?.servings || "4"}
                </p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Difficulty</p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {selectedRecipe.content?.recipeInfo?.difficulty || "Easy"}
                </p>
              </div>
            </div>

            {/* Introduction */}
            {selectedRecipe.content?.introduction && (
              <div className="space-y-2 mb-6 text-xs text-muted-foreground leading-relaxed">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Introduction:
                </h4>
                {selectedRecipe.content.introduction.map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}

            {/* Ingredient Groups */}
            {selectedRecipe.content?.ingredientGroups && (
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Ingredients:
                </h4>
                {selectedRecipe.content.ingredientGroups.map((group: RecipeIngredientGroup, idx: number) => (
                  <div key={idx} className="bg-muted p-4 rounded-xl border border-border text-xs">
                    <h5 className="font-bold text-foreground mb-2 text-xs">{group.title}</h5>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {group.ingredients?.map((ing: RecipeIngredient, iIdx: number) => (
                        <li key={iIdx} className="flex items-center justify-between">
                          <span>{ing.name}</span>
                          <span className="font-semibold text-foreground">{ing.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Step-by-Step Method */}
            {selectedRecipe.content?.steps && (
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Preparation Steps:
                </h4>
                {selectedRecipe.content.steps.map((rawStep, idx: number) => {
                  const step = typeof rawStep === "string" ? { title: `Step ${idx + 1}`, description: rawStep, instructions: [] } : rawStep;
                  return (
                    <div key={idx} className="bg-muted p-4 rounded-xl border border-border text-xs">
                      <h5 className="font-bold text-foreground mb-1.5">{step.title}</h5>
                      {step.description && (
                        <p className="text-muted-foreground leading-relaxed mb-2">
                          {step.description}
                        </p>
                      )}
                      {step.instructions && step.instructions.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                          {step.instructions.map((inst: string, instIdx: number) => (
                            <li key={instIdx}>{inst}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-right pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-card-foreground">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#d4af37]" />
                Edit Collaborative Recipe
              </h3>
              <button
                type="button"
                onClick={() => setEditingRecipe(null)}
                className="w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecipeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Recipe Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardamom Rose Phirni"
                    value={editRecipeForm.title}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, title: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Chef / Author</label>
                  <input
                    type="text"
                    placeholder="e.g. Shimi's Kitchen"
                    value={editRecipeForm.author}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, author: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Category</label>
                  <select
                    value={editRecipeForm.category}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, category: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Festive">Festive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Prep Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 mins"
                    value={editRecipeForm.prepTime}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, prepTime: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Cook Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 mins"
                    value={editRecipeForm.cookTime}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, cookTime: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Servings</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 servings"
                    value={editRecipeForm.servings}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, servings: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Difficulty</label>
                  <select
                    value={editRecipeForm.difficulty}
                    onChange={(e) => setEditRecipeForm({ ...editRecipeForm, difficulty: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty or enter image URL"
                  value={editRecipeForm.image}
                  onChange={(e) => setEditRecipeForm({ ...editRecipeForm, image: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of this recipe..."
                  value={editRecipeForm.description}
                  onChange={(e) => setEditRecipeForm({ ...editRecipeForm, description: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Ingredients (One per line: &ldquo;Item - Quantity&rdquo;)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Emperor Akbar Cardamom - 6 pods&#10;Full cream milk - 500 ml"
                  value={editRecipeForm.ingredientsText}
                  onChange={(e) => setEditRecipeForm({ ...editRecipeForm, ingredientsText: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Preparation Steps (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Crush the cardamom pods gently.&#10;Bring the milk to a gentle boil."
                  value={editRecipeForm.stepsText}
                  onChange={(e) => setEditRecipeForm({ ...editRecipeForm, stepsText: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4af37] resize-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Recipe Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
