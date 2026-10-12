"use client";

import React, { useState } from "react";
import { HeartPulse, Edit2 } from "lucide-react";

export interface HealthTopic {
  title: string;
  description: string;
}

interface HealthViewProps {
  healthTopics: HealthTopic[];
  onSaveHealthTopics: (updated: HealthTopic[]) => void;
}

export default function HealthView({ healthTopics, onSaveHealthTopics }: HealthViewProps) {
  const [topics, setTopics] = useState<HealthTopic[]>(healthTopics || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempTopic, setTempTopic] = useState<Partial<HealthTopic>>({});

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setTempTopic({ ...topics[idx] });
  };

  const handleSave = () => {
    if (editingIndex === null) return;
    const updated = [...topics];
    updated[editingIndex] = tempTopic as HealthTopic;
    setTopics(updated);
    onSaveHealthTopics(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm text-card-foreground">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-primary dark:text-[#d4af37]" />
            &ldquo;Doctor of Spices&rdquo; Wellness Topics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage the health benefits, medicinal facts, and Ayurvedic insights displayed at /health-benefits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map((t, idx) => {
          const isEditing = editingIndex === idx;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm relative flex flex-col justify-between hover:border-primary/40 dark:hover:border-[#d4af37]/40 transition-all text-card-foreground"
            >
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-foreground font-semibold mb-1">Topic Title</label>
                    <input
                      type="text"
                      value={tempTopic.title || ""}
                      onChange={(e) => setTempTopic({ ...tempTopic, title: e.target.value })}
                      className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-1">Wellness Description</label>
                    <textarea
                      rows={3}
                      value={tempTopic.description || ""}
                      onChange={(e) => setTempTopic({ ...tempTopic, description: e.target.value })}
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
                      Save Topic
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-foreground text-base font-sans">
                        {t.title}
                      </h3>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="w-8 h-8 rounded-lg bg-muted/60 hover:bg-muted text-foreground border border-border flex items-center justify-center cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary dark:text-[#d4af37]" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Topic #{idx + 1}</span>
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-primary dark:text-[#d4af37] hover:underline font-semibold cursor-pointer"
                    >
                      Edit Description
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
