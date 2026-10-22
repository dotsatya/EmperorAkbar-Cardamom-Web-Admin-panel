"use client";

import React, { useState } from "react";
import {
  HeartPulse,
  Search,
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [inspectingTopic, setInspectingTopic] = useState<{
    topic: HealthTopic;
    idx: number;
  } | null>(null);
  const [formTopic, setFormTopic] = useState<Partial<HealthTopic>>({
    title: "",
    description: "",
  });

  const handleOpenEdit = (idx: number) => {
    setEditingIndex(idx);
    setFormTopic({ ...topics[idx] });
    setIsCreating(false);
    setInspectingTopic(null);
  };

  const handleOpenCreate = () => {
    setFormTopic({
      title: "",
      description: "",
    });
    setEditingIndex(null);
    setIsCreating(true);
    setInspectingTopic(null);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setIsCreating(false);
    setFormTopic({ title: "", description: "" });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.title?.trim() || !formTopic.description?.trim()) return;

    let updated: HealthTopic[];
    if (isCreating) {
      updated = [...topics, { title: formTopic.title.trim(), description: formTopic.description.trim() }];
    } else if (editingIndex !== null) {
      updated = [...topics];
      updated[editingIndex] = {
        title: formTopic.title.trim(),
        description: formTopic.description.trim(),
      };
    } else {
      return;
    }

    setTopics(updated);
    onSaveHealthTopics(updated);
    handleCloseModal();
  };

  const handleDelete = (idx: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = topics.filter((_, i) => i !== idx);
      setTopics(updated);
      onSaveHealthTopics(updated);
      if (inspectingTopic && inspectingTopic.idx === idx) {
        setInspectingTopic(null);
      }
    }
  };

  const filteredTopics = topics.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#d4af37]" />
            &ldquo;Doctor of Spices&rdquo; Wellness Topics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage the health benefits, medicinal facts, and Ayurvedic insights displayed at /health-benefits
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground hidden sm:inline-block">
            Total Topics: <span className="text-foreground font-bold">{topics.length}</span>
          </span>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search wellness topics by title, digestion, antioxidants, Ayurvedic claims..."
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

      {/* Wellness Topics Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 px-4">
            <HeartPulse className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground text-sm font-semibold">No topics matched</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-bold tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Topic # &amp; Title</th>
                  <th className="py-3.5 px-4">Ayurvedic &amp; Health Benefit Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTopics.map((t, idx) => {
                  const originalIndex = topics.findIndex((item) => item.title === t.title);
                  const activeIndex = originalIndex !== -1 ? originalIndex : idx;

                  return (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center font-mono font-bold text-foreground text-xs shrink-0">
                            #{activeIndex + 1}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-foreground text-sm block truncate max-w-[220px]">
                              {t.title}
                            </span>
                         
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-muted-foreground line-clamp-2 max-w-lg leading-relaxed">
                          {t.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectingTopic({ topic: t, idx: activeIndex })}
                            className="px-2.5 py-1.5 rounded-lg bg-[#d4af37] text-stone-900 hover:bg-[#e5bf45] transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            title="Inspect Topic"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(activeIndex)}
                            className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground hover:bg-muted/80 hover:border-[#d4af37]/50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                            title="Edit Topic"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(activeIndex, t.title)}
                            className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete Topic"
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

      {/* Inspect Topic Modal */}
      {inspectingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37]">
                  Doctor of Spices Insight
                </span>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <Activity className="w-5 h-5 text-[#d4af37]" />
                  <span>{inspectingTopic.topic.title}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingTopic(null)}
                className="w-8 h-8 rounded-lg bg-muted text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-muted p-4 rounded-2xl border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                  Wellness &amp; Health Insights
                </span>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                  {inspectingTopic.topic.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-[11px] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Ayurvedic &amp; Botanical health claim on public portal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => handleOpenEdit(inspectingTopic.idx)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Topic</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectingTopic(null)}
                className="px-5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Topic Modal */}
      {(editingIndex !== null || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-foreground">
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  {isCreating ? "New Entry" : "Update Entry"}
                </span>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <HeartPulse className="w-5 h-5 text-[#d4af37]" />
                  <span>
                    {isCreating ? "Add Wellness Topic" : `Edit: ${formTopic.title}`}
                  </span>
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

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Wellness Topic Title
                </label>
                <input
                  type="text"
                  required
                  value={formTopic.title || ""}
                  onChange={(e) => setFormTopic({ ...formTopic, title: e.target.value })}
                  placeholder="e.g. Digestive Health & Natural Metabolism"
                  className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Therapeutic Description &amp; Health Insights
                </label>
                <textarea
                  rows={4}
                  required
                  value={formTopic.description || ""}
                  onChange={(e) => setFormTopic({ ...formTopic, description: e.target.value })}
                  placeholder="Explain the botanical advantages, digestive benefits, and traditional Ayurvedic knowledge..."
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
                  {isCreating ? "Add Wellness Topic" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
