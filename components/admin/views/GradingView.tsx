"use client";

import React, { useState } from "react";
import {
  Award,
  Search,
  Eye,
  Edit2,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export interface GradeItem {
  name: string;
  size: string;
  description: string;
  color?: string;
  diameter?: string;
}

interface GradingViewProps {
  grading: GradeItem[];
  onSaveGrading: (updated: GradeItem[]) => void;
}

export default function GradingView({ grading, onSaveGrading }: GradingViewProps) {
  const [gradesList, setGradesList] = useState<GradeItem[]>(grading || []);
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inspectingGrade, setInspectingGrade] = useState<{
    grade: GradeItem;
    idx: number;
  } | null>(null);
  const [tempGrade, setTempGrade] = useState<Partial<GradeItem>>({});

  const getGradeTheme = (identifier: string | undefined, idx: number) => {
    const n = (identifier || "").toLowerCase();
    if (n.includes("purple") || idx === 0) {
      return {
        color: "Purple",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        dot: "bg-purple-500 shadow-sm shadow-purple-500/50",
        tag: "Tier 1 — Export Supreme Quality",
        defaultName: "Purple Grade Cardamom",
        defaultDiameter: "8.0 mm & Above",
        defaultQuality: "Premium large pods (8mm & above) with highest aroma concentration",
      };
    }
    if (n.includes("pink") || idx === 1) {
      return {
        color: "Pink",
        badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
        dot: "bg-pink-500 shadow-sm shadow-pink-500/50",
        tag: "Tier 2 — Extra Bold Quality",
        defaultName: "Pink Grade Cardamom",
        defaultDiameter: "7.5 mm – 8.0 mm",
        defaultQuality: "Large pods (7.5mm – 8mm) with exceptional gourmet flavor",
      };
    }
    if (n.includes("green") || idx === 2) {
      return {
        color: "Green",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500 shadow-sm shadow-emerald-500/50",
        tag: "Tier 3 — Bold Alleppey Quality",
        defaultName: "Green Grade Cardamom",
        defaultDiameter: "7.0 mm – 7.5 mm",
        defaultQuality: "Medium-large pods (7mm – 7.5mm) with authentic Alleppey sweetness",
      };
    }
    if (n.includes("orange") || idx === 3) {
      return {
        color: "Orange",
        badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        dot: "bg-orange-500 shadow-sm shadow-orange-500/50",
        tag: "Tier 4 — Super Grade Quality",
        defaultName: "Orange Grade Cardamom",
        defaultDiameter: "6.5 mm – 7.0 mm",
        defaultQuality: "Medium pods (6.5mm – 7mm) ideal for aromatic culinary blending",
      };
    }
    return {
      color: "Red",
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      dot: "bg-rose-500 shadow-sm shadow-rose-500/50",
      tag: "Tier 5 — Standard Grade Quality",
      defaultName: "Red Grade Cardamom",
      defaultDiameter: "6.0 mm – 6.5 mm",
      defaultQuality: "Smaller pods (6mm – 6.5mm) with standard essential oil content",
    };
  };

  const handleOpenEdit = (idx: number) => {
    const raw = gradesList[idx];
    const theme = getGradeTheme(raw?.name || raw?.color, idx);
    setEditingIndex(idx);
    setTempGrade({
      name: raw?.name || theme.defaultName,
      color: raw?.color || theme.color,
      size: raw?.size || raw?.diameter || theme.defaultDiameter,
      diameter: raw?.diameter || raw?.size || theme.defaultDiameter,
      description: raw?.description || theme.defaultQuality,
    });
    setInspectingGrade(null);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setTempGrade({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null) return;
    const theme = getGradeTheme(tempGrade.name || tempGrade.color, editingIndex);
    const updatedItem: GradeItem = {
      name: tempGrade.name?.trim() || theme.defaultName,
      color: tempGrade.color?.trim() || theme.color,
      size: tempGrade.size?.trim() || tempGrade.diameter?.trim() || theme.defaultDiameter,
      diameter: tempGrade.diameter?.trim() || tempGrade.size?.trim() || theme.defaultDiameter,
      description: tempGrade.description?.trim() || theme.defaultQuality,
    };
    const updated = [...gradesList];
    updated[editingIndex] = updatedItem;
    setGradesList(updated);
    onSaveGrading(updated);
    setEditingIndex(null);
  };

  // Pre-normalize all grades to guarantee all fields (name, color, diameter, quality) are populated
  const normalizedGrades = (gradesList.length > 0 ? gradesList : [
    { name: "Purple Grade Cardamom", color: "Purple", size: "8.0 mm & Above", description: "Premium large pods (8mm & above)" },
    { name: "Pink Grade Cardamom", color: "Pink", size: "7.5 mm – 8.0 mm", description: "Large pods (7.5mm – 8mm)" },
    { name: "Green Grade Cardamom", color: "Green", size: "7.0 mm – 7.5 mm", description: "Medium-large pods (7mm – 7.5mm)" },
    { name: "Orange Grade Cardamom", color: "Orange", size: "6.5 mm – 7.0 mm", description: "Medium pods (6.5mm – 7mm)" },
    { name: "Red Grade Cardamom", color: "Red", size: "6.0 mm – 6.5 mm", description: "Smaller pods (6mm – 6.5mm)" },
  ]).map((g, idx) => {
    const theme = getGradeTheme(g?.name || g?.color, idx);
    const color = g?.color || theme.color;
    const name = g?.name && g.name.trim() ? g.name : `${color} Grade Cardamom`;
    const size = g?.size && g.size.trim() ? g.size : g?.diameter && g.diameter.trim() ? g.diameter : theme.defaultDiameter;
    const description = g?.description && g.description.trim() ? g.description : theme.defaultQuality;

    return {
      ...g,
      originalIdx: idx,
      color,
      name,
      size,
      diameter: size,
      description,
      theme,
    };
  });

  const filteredGrades = normalizedGrades.filter((g) => {
    const query = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(query) ||
      g.color.toLowerCase().includes(query) ||
      g.size.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      g.theme.tag.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            Cardamom Grading Specifications
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Official 5-grade quality standards used in customer packaging &amp; interactive visualizer (/cardamom-grades)
          </p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground">
          Official Grades: <span className="text-foreground font-bold">{normalizedGrades.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search by grade (Purple, Pink, Green...), diameter spec, or quality tier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-10 pr-9 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-colors"
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

      {/* Grading Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        {filteredGrades.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground text-sm font-semibold">No grades matched</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-bold tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Grade &amp; Color</th>
                  <th className="py-3.5 px-4">Pod Diameter Spec</th>
                  <th className="py-3.5 px-4">Quality &amp; Characteristics</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredGrades.map((g) => {
                  return (
                    <tr key={g.originalIdx} className="hover:bg-muted/50 transition-colors">
                      {/* Grade & Color Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center font-mono font-bold text-foreground text-xs shrink-0">
                            #{g.originalIdx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${g.theme.dot} shrink-0`} />
                              <span className="font-bold text-foreground text-sm">
                                {g.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${g.theme.badge}`}>
                                {g.color}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              Official Emperor Akbar {g.color} Standard
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pod Diameter Spec Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-xs px-2.5 py-1 rounded-lg bg-muted border border-border">
                            {g.size}
                          </span>
                        </div>
                      </td>

                      {/* Quality & Characteristics Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-md">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${g.theme.badge} inline-block`}>
                            {g.theme.tag}
                          </span>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {g.description}
                          </p>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectingGrade({ grade: g, idx: g.originalIdx })}
                            className="px-2.5 py-1.5 rounded-lg bg-[#d4af37] text-stone-900 hover:bg-[#e5bf45] transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            title="Inspect Specification"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(g.originalIdx)}
                            className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground hover:bg-muted/80 hover:border-[#d4af37]/50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                            title="Edit Grade Spec"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span className="hidden sm:inline">Edit</span>
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

      {/* Inspect Grade Modal */}
      {inspectingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Grade Specification
                </span>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <span className={`w-3 h-3 rounded-full ${getGradeTheme(inspectingGrade.grade.name || inspectingGrade.grade.color, inspectingGrade.idx).dot}`} />
                  <span>{inspectingGrade.grade.name}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingGrade(null)}
                className="w-8 h-8 rounded-lg bg-muted text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getGradeTheme(inspectingGrade.grade.name || inspectingGrade.grade.color, inspectingGrade.idx).badge}`}>
                  Color: {inspectingGrade.grade.color || getGradeTheme(inspectingGrade.grade.name, inspectingGrade.idx).color}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-muted border border-border text-foreground">
                  Quality: {getGradeTheme(inspectingGrade.grade.name || inspectingGrade.grade.color, inspectingGrade.idx).tag}
                </span>
              </div>

              <div className="bg-muted p-4 rounded-2xl border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  Pod Diameter Specification
                </span>
                <span className="text-2xl font-mono font-bold text-[#d4af37]">
                  {inspectingGrade.grade.size || inspectingGrade.grade.diameter}
                </span>
              </div>

              <div className="bg-muted p-4 rounded-2xl border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  Quality &amp; Botanical Characteristics
                </span>
                <p className="text-foreground leading-relaxed">
                  {inspectingGrade.grade.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-[11px] pt-2">
                <Layers className="w-4 h-4 text-[#d4af37]" />
                <span>Grade Category #{inspectingGrade.idx + 1} of 5 in official Emperor Akbar sorting standards</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => handleOpenEdit(inspectingGrade.idx)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Specification</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectingGrade(null)}
                className="px-5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Grade Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Update Specification
                </span>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Edit: {gradesList[editingIndex]?.name || `${gradesList[editingIndex]?.color || "Grade"} Cardamom`}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-muted text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    Grade Title
                  </label>
                  <input
                    type="text"
                    required
                    value={tempGrade.name || ""}
                    onChange={(e) => setTempGrade({ ...tempGrade, name: e.target.value })}
                    placeholder="e.g. Purple Grade Cardamom"
                    className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    Grade Color
                  </label>
                  <input
                    type="text"
                    required
                    value={tempGrade.color || ""}
                    onChange={(e) => setTempGrade({ ...tempGrade, color: e.target.value })}
                    placeholder="e.g. Purple, Pink, Green, Orange, Red"
                    className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Pod Diameter Specification
                </label>
                <input
                  type="text"
                  required
                  value={tempGrade.size || tempGrade.diameter || ""}
                  onChange={(e) => setTempGrade({ ...tempGrade, size: e.target.value, diameter: e.target.value })}
                  placeholder="e.g. 8.0 mm & Above"
                  className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder-muted-foreground font-mono focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Quality Tier &amp; Characteristics
                </label>
                <textarea
                  rows={4}
                  required
                  value={tempGrade.description || ""}
                  onChange={(e) => setTempGrade({ ...tempGrade, description: e.target.value })}
                  placeholder="Description of pod size, color, aroma, quality tier..."
                  className="w-full bg-muted border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-all resize-y leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Save Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
