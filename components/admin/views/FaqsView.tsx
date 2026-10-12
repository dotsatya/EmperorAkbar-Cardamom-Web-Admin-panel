"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, Edit2, Trash2, X } from "lucide-react";

export interface FAQCategory {
  category: string;
  items: { question: string; answer: string }[];
}

interface FaqsViewProps {
  faqs: FAQCategory[];
  onSaveFaqs: (updated: FAQCategory[]) => void;
}

export default function FaqsView({ faqs, onSaveFaqs }: FaqsViewProps) {
  const [faqList, setFaqList] = useState<FAQCategory[]>(faqs || []);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [editingItem, setEditingItem] = useState<{
    catIdx: number;
    itemIdx: number;
    question: string;
    answer: string;
  } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const currentCategory = faqList[activeCategoryIndex] || faqList[0];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = [...faqList];
    updated[editingItem.catIdx].items[editingItem.itemIdx] = {
      question: editingItem.question,
      answer: editingItem.answer,
    };
    setFaqList(updated);
    onSaveFaqs(updated);
    setEditingItem(null);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;

    const updated = [...faqList];
    updated[activeCategoryIndex].items.push({
      question: newQuestion,
      answer: newAnswer,
    });
    setFaqList(updated);
    onSaveFaqs(updated);
    setNewQuestion("");
    setNewAnswer("");
    setIsAdding(false);
  };

  const handleDeleteItem = (catIdx: number, itemIdx: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const updated = [...faqList];
      updated[catIdx].items.splice(itemIdx, 1);
      setFaqList(updated);
      onSaveFaqs(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#d4af37]" />
            FAQ Knowledge Base Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage questions &amp; answers displayed on the /faq customer support page
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {faqList.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategoryIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategoryIndex === idx
                ? "bg-[#d4af37] text-stone-900 font-bold shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat.category} ({cat.items.length})
          </button>
        ))}
      </div>

      {/* FAQs List under Active Category */}
      <div className="space-y-4">
        {currentCategory?.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm relative flex flex-col justify-between hover:border-[#d4af37]/40 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-[#d4af37]">Q{idx + 1}.</span>
                {item.question}
              </h3>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() =>
                    setEditingItem({
                      catIdx: activeCategoryIndex,
                      itemIdx: idx,
                      question: item.question,
                      answer: item.answer,
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-muted hover:bg-[#d4af37] hover:text-stone-900 text-muted-foreground transition-colors flex items-center justify-center"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem(activeCategoryIndex, idx)}
                  className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 dark:text-red-400 transition-colors flex items-center justify-center"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pl-6 border-l-2 border-border mt-1">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Edit FAQ Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-card-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground">Edit Question &amp; Answer</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground font-semibold mb-1.5">Question</label>
                <input
                  type="text"
                  required
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.answer}
                  onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-stone-900 font-bold uppercase tracking-wider"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New FAQ Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-card-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground">
                Add FAQ in &ldquo;{currentCategory?.category}&rdquo;
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="w-7 h-7 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground font-semibold mb-1.5">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How should Emperor Akbar cardamom be stored?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Answer</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-stone-900 font-bold uppercase tracking-wider"
                >
                  Create FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
