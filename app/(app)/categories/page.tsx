"use client";

import * as React from "react";
import { Home, Coffee, PiggyBank, X, CheckCircle, Grid3X3 } from "lucide-react";

import { api } from "@/lib/api-client";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

// Bucket pills configuration - matches transaction-sheet pattern
const BUCKET_PILLS = [
  {
    key: "needs" as const,
    label: "Needs",
    icon: Home,
    color: "#8b9a7e",
    borderColor: "border-[#8b9a7e]",
    textColor: "text-[#8b9a7e]",
  },
  {
    key: "wants" as const,
    label: "Wants",
    icon: Coffee,
    color: "#c97a5a",
    borderColor: "border-[#c97a5a]",
    textColor: "text-[#c97a5a]",
  },
  {
    key: "future" as const,
    label: "Future",
    icon: PiggyBank,
    color: "#a89562",
    borderColor: "border-[#a89562]",
    textColor: "text-[#a89562]",
  },
];

// Curated emoji set for categories (30 essential icons)
const CATEGORY_EMOJIS = [
  "🍔",
  "☕",
  "🍺",
  "🛒",
  "🍕",
  "🏠",
  "💡",
  "⚡",
  "🛜",
  "🔥",
  "🚗",
  "⛽",
  "🚌",
  "🚲",
  "✈️",
  "💊",
  "👕",
  "💇",
  "🧴",
  "🏋️",
  "💰",
  "💵",
  "💳",
  "🏦",
  "📈",
  "🎬",
  "🎮",
  "🎁",
  "🎵",
  "📚",
];

const CategoryCard = React.memo(function CategoryCard({
  category,
  onEdit,
}: {
  category: Category;
  onEdit: (c: Category) => void;
}) {
  const bucket = category.allocationBucket;
  const bucketColor =
    bucket === "needs" ? "#8b9a7e" : bucket === "wants" ? "#c97a5a" : "#a89562";

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: `${bucketColor}20` }}
          >
            {category.icon ?? "💡"}
          </div>
          <div>
            <div className="font-semibold text-foreground">{category.name}</div>
            {bucket ? (
              <div
                className="text-xs font-medium capitalize"
                style={{ color: bucketColor }}
              >
                {bucket}
              </div>
            ) : null}
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onEdit(category)}
          className="rounded-xl"
        >
          Edit
        </Button>
      </div>
    </Card>
  );
});

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [type, setType] = React.useState<"income" | "expense">("expense");
  const [bucket, setBucket] = React.useState<"needs" | "wants" | "future">(
    "needs",
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [allocationBucket, setAllocationBucket] = React.useState<
    "needs" | "wants" | "future"
  >("needs");
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.categories.list(type);
      setCategories(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [type]);

  React.useEffect(() => {
    load();
  }, [load]);

  const openEditor = React.useCallback((category?: Category) => {
    setEditing(category ?? null);
    setName(category?.name ?? "");
    setIcon(category?.icon ?? "");
    setAllocationBucket(
      (category?.allocationBucket ?? "needs") as "needs" | "wants" | "future",
    );
    setError(null);
    setOpen(true);
  }, []);

  const closeEditor = React.useCallback(() => {
    setOpen(false);
  }, []);

  const save = React.useCallback(async () => {
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        icon: icon.trim() || null,
        type,
        allocationBucket: type === "expense" ? allocationBucket : null,
      };
      if (editing) {
        await api.categories.update(editing.id, payload);
      } else {
        await api.categories.create(payload);
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category");
    } finally {
      setSaving(false);
    }
  }, [name, icon, type, allocationBucket, editing, load]);

  const visible = React.useMemo(
    () =>
      type === "expense"
        ? categories.filter((item) => item.allocationBucket === bucket)
        : categories,
    [type, categories, bucket],
  );

  // Preview data for the visual preview
  const previewCategory = React.useMemo(
    () => ({
      name: name.trim() || "Category Name",
      icon: icon.trim() || "💡",
      allocationBucket: type === "expense" ? allocationBucket : null,
    }),
    [name, icon, type, allocationBucket],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Organize your spending."
        action={
          <Button variant="secondary" onClick={() => openEditor()}>
            New Category
          </Button>
        }
      />

      <Tabs
        value={type}
        onValueChange={(value) => setType(value as "income" | "expense")}
      >
        <TabsList className="w-full bg-card border border-border p-1 rounded-2xl">
          <TabsTrigger
            value="expense"
            className="flex-1 rounded-xl data-[state=active]:bg-expense data-[state=active]:text-white"
          >
            Expense
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="flex-1 rounded-xl data-[state=active]:bg-income data-[state=active]:text-white"
          >
            Income
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {type === "expense" ? (
        <Tabs
          value={bucket}
          onValueChange={(value) =>
            setBucket(value as "needs" | "wants" | "future")
          }
        >
          <TabsList className="w-full bg-card border border-border p-1 rounded-2xl">
            <TabsTrigger
              value="needs"
              className="flex-1 rounded-xl data-[state=active]:bg-needs"
            >
              Needs
            </TabsTrigger>
            <TabsTrigger
              value="wants"
              className="flex-1 rounded-xl data-[state=active]:bg-wants"
            >
              Wants
            </TabsTrigger>
            <TabsTrigger
              value="future"
              className="flex-1 rounded-xl data-[state=active]:bg-future"
            >
              Future
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}

      {loading && categories.length === 0 ? (
        <Card className="p-8 text-sm text-muted-foreground text-center bg-card">
          <div className="animate-pulse">Loading categories...</div>
        </Card>
      ) : null}

      {visible.length === 0 && !loading ? (
        <Card className="p-8 text-center bg-card border-border">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-muted-foreground">
            No {type} categories found.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Create one to get started.
          </p>
        </Card>
      ) : null}

      <div className="space-y-3">
        {visible.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={openEditor}
          />
        ))}
      </div>

      {/* Category Sheet - Following transaction-sheet layout */}
      <Sheet open={open} onOpenChange={(next) => !next && closeEditor()}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[90vh] rounded-t-4xl border border-border bg-card p-0"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold">
                  {editing ? "Edit Category" : "New Category"}
                </SheetTitle>
                <button
                  onClick={closeEditor}
                  className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Visual Preview */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Preview
                </Label>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                    style={{
                      backgroundColor:
                        type === "expense"
                          ? allocationBucket === "needs"
                            ? "#8b9a7e20"
                            : allocationBucket === "wants"
                              ? "#c97a5a20"
                              : "#a8956220"
                          : "#9fb89f20",
                    }}
                  >
                    {previewCategory.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {previewCategory.name}
                    </div>
                    {type === "expense" && previewCategory.allocationBucket ? (
                      <div
                        className="text-xs font-medium capitalize"
                        style={{
                          color:
                            allocationBucket === "needs"
                              ? "#8b9a7e"
                              : allocationBucket === "wants"
                                ? "#c97a5a"
                                : "#a89562",
                        }}
                      >
                        {previewCategory.allocationBucket}
                      </div>
                    ) : (
                      <div className="text-xs text-[#9fb89f] font-medium">
                        Income
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Groceries, Salary, Rent..."
                  className="h-14 rounded-2xl bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[#c97a5a] focus:border-[#c97a5a]"
                />
              </div>

              {/* Emoji Grid Picker */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Choose an Icon
                  </Label>
                </div>
                <div className="grid grid-cols-5 gap-1 p-2 rounded-xl bg-background border border-border max-h-[180px] overflow-y-auto place-items-center">
                  {CATEGORY_EMOJIS.map((emoji) => {
                    const isSelected = icon === emoji;
                    return (
                      <button
                        key={emoji}
                        onClick={() => setIcon(isSelected ? "" : emoji)}
                        className={`h-10 w-10 flex items-center justify-center text-xl rounded-lg transition-all hover:scale-105 active:scale-95 ${
                          isSelected
                            ? "bg-[#c97a5a]/20 ring-2 ring-[#c97a5a]"
                            : "hover:bg-border"
                        }`}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bucket Selection - Visual Pills (only for expenses) */}
              {type === "expense" && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Allocation Bucket
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {BUCKET_PILLS.map((pill) => {
                      const Icon = pill.icon;
                      const isSelected = allocationBucket === pill.key;
                      return (
                        <button
                          key={pill.key}
                          onClick={() => setAllocationBucket(pill.key)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-3xl bg-background border-2 transition-all hover:scale-[1.02] ${
                            isSelected
                              ? `${pill.borderColor} ${pill.textColor}`
                              : "border-transparent text-muted-foreground hover:border-[#c97a5a]/30"
                          }`}
                          style={
                            isSelected
                              ? {
                                  borderColor: pill.color,
                                  color: pill.color,
                                  backgroundColor: `${pill.color}10`,
                                }
                              : {}
                          }
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {pill.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error ? (
                <p className="text-sm text-red-400 text-center bg-red-400/10 p-3 rounded-xl">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Footer / Submit Button */}
            <div className="px-6 pb-8 pt-4 border-t border-border bg-card">
              <Button
                onClick={save}
                disabled={saving || !name.trim()}
                className="w-full py-6 rounded-3xl bg-linear-to-r from-[#c97a5a] to-[#a36248] text-white font-bold text-lg shadow-xl shadow-[#c97a5a44] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
                <CheckCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
