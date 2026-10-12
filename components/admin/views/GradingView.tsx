"use client";

import React, { useState } from "react";
import { Sparkles, Edit2 } from "lucide-react";

export interface GradeItem {
  name: string;
  size: string;
  description: string;
}

interface GradingViewProps {
  grading: GradeItem[];
  onSaveGrading: (updated: GradeItem[]) => void;
}

export default function GradingView({ grading, onSaveGrading }: GradingViewProps) {
  const [gradesList, setGradesList] = useState<GradeItem[]>(grading || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempGrade, setTempGrade] = useState<Partial<GradeItem>>({});

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setTempGrade({ ...gradesList[idx] });
  };

  const handleSave = () => {
    if (editingIndex === null) return;
    const updated = [...gradesList];
    updated[editingIndex] = tempGrade as GradeItem;
    setGradesList(updated);
    onSaveGrading(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm text-card-foreground">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
           Cardamom Grading Specifications
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Customize the 5 official grading standards shown in the interactive visualizer (/cardamom-grades)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gradesList.map((g, idx) => {
          const isEditing = editingIndex === idx;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm relative flex flex-col justify-between hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all text-card-foreground"
            >
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-foreground font-semibold mb-1">Grade Title</label>
                    <input
                      type="text"
                      value={tempGrade.name || ""}
                      onChange={(e) => setTempGrade({ ...tempGrade, name: e.target.value })}
                      className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-1">Diameter Spec</label>
                    <input
                      type="text"
                      value={tempGrade.size || ""}
                      onChange={(e) => setTempGrade({ ...tempGrade, size: e.target.value })}
                      className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-1">Characteristics</label>
                    <textarea
                      rows={2}
                      value={tempGrade.description || ""}
                      onChange={(e) => setTempGrade({ ...tempGrade, description: e.target.value })}
                      className="w-full bg-background border border-input rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-900 font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary dark:bg-[#d4af37]" />
                        <h3 className="font-bold text-foreground text-base font-sans">
                          {g.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="w-8 h-8 rounded-lg bg-muted/60 hover:bg-muted text-foreground border border-border flex items-center justify-center cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary dark:text-[#d4af37]" />
                      </button>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl border border-border mb-3 text-xs">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Pod Size Diameter
                      </span>
                      <span className="font-mono font-bold text-primary dark:text-[#d4af37] text-sm">
                        {g.size}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Grade Category {idx + 1} of 5</span>
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-primary dark:text-[#d4af37] hover:underline font-semibold cursor-pointer"
                    >
                      Edit Grade Spec
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
