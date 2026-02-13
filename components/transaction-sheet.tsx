"use client";

import * as React from "react";
import {
  CheckCircle,
  Home,
  Coffee,
  PiggyBank,
  X,
  CalendarIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { api } from "@/lib/api-client";
import type { Category, Transaction } from "@/types";
import {
  getFontSizeClass,
  formatNumberWithCommas,
  cleanNumber,
  isValidAmount,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTransactionSheet } from "@/components/transaction-sheet-context";

const defaultDate = () => format(new Date(), "yyyy-MM-dd");

const BUCKET_PILLS = [
  {
    key: "needs",
    label: "Needs",
    icon: Home,
    color: "text-needs",
    borderColor: "border-needs",
    textColor: "text-needs",
  },
  {
    key: "wants",
    label: "Wants",
    icon: Coffee,
    color: "text-wants",
    borderColor: "border-wants",
    textColor: "text-wants",
  },
  {
    key: "future",
    label: "Future",
    icon: PiggyBank,
    color: "text-future",
    borderColor: "border-future",
    textColor: "text-future",
  },
];

// Form state interface (@vercel rerender-derived-state-no-effect)
interface FormState {
  amount: string;
  type: "income" | "expense";
  categoryId: string | null;
  date: string;
  description: string;
  selectedBucket: string | null;
}

// Reset form to initial or transaction values
function getInitialState(
  mode: "create" | "edit",
  transaction?: Transaction | null,
): FormState {
  if (mode === "edit" && transaction) {
    return {
      amount: transaction.amount ?? "",
      type: transaction.type ?? "expense",
      categoryId: transaction.categoryId ?? null,
      date: transaction.date?.slice(0, 10) ?? defaultDate(),
      description: transaction.description ?? "",
      selectedBucket: transaction.category?.allocationBucket ?? null,
    };
  }
  return {
    amount: "",
    type: "expense",
    categoryId: null,
    date: defaultDate(),
    description: "",
    selectedBucket: "needs",
  };
}

export function TransactionSheet() {
  const { open, mode, transaction, close } = useTransactionSheet();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Consolidated form state (@vercel rerender-lazy-state-init)
  const [form, setForm] = React.useState<FormState>(() =>
    getInitialState(mode, transaction),
  );

  // Load categories when opened
  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.categories
      .list()
      .then((data: Category[]) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [open]);

  // Reset form when mode/transaction changes
  React.useEffect(() => {
    setForm(getInitialState(mode, transaction));
    setError(null);
  }, [mode, transaction, open]);

  // Form field updater
  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, description: form.description || "" };
      if (mode === "edit" && transaction) {
        await api.transactions.update(transaction.id, payload);
      } else {
        await api.transactions.create(payload);
      }
      window.dispatchEvent(new Event("transactions:changed"));
      close();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save transaction",
      );
    } finally {
      setSaving(false);
    }
  };

  // Derive filtered categories during render (@vercel rerender-derived-state-no-effect)
  const filteredCategories = React.useMemo(() => {
    if (form.type === "income")
      return categories.filter((c) => c.type === "income");
    if (form.selectedBucket)
      return categories.filter(
        (c) =>
          c.allocationBucket === form.selectedBucket && c.type === "expense",
      );
    return [];
  }, [categories, form.type, form.selectedBucket]);

  // Get color for category based on bucket/type
  const getCategoryColor = (bucket: string | null): string => {
    if (form.type === "income") return "#9fb89f";
    return bucket === "needs"
      ? "#8b9a7e"
      : bucket === "wants"
        ? "#c97a5a"
        : bucket === "future"
          ? "#a89562"
          : "#c97a5a";
  };

  const fontSizeClass = getFontSizeClass(
    formatNumberWithCommas(form.amount).length,
  );

  return (
    <Sheet open={open} onOpenChange={(next) => !next && close()}>
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
                {mode === "edit" ? "Edit Awareness" : "New Awareness"}
              </SheetTitle>
              <button
                onClick={close}
                className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Amount Input */}
            <div className="space-y-2 text-center">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Spending Amount
              </Label>
              <div className="relative flex items-center justify-center group overflow-hidden">
                <span
                  className={`font-extrabold text-primary mr-2 font-mono transition-all duration-200 ${fontSizeClass}`}
                >
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9,]*"
                  placeholder="0.00"
                  autoFocus
                  className={`bg-transparent border-none text-center font-extrabold font-mono focus:outline-none focus:ring-0 w-full placeholder:text-muted-foreground/20 text-foreground p-0 transition-all duration-200 ${fontSizeClass}`}
                  value={formatNumberWithCommas(form.amount)}
                  onChange={(e) => {
                    const cleanValue = cleanNumber(e.target.value);
                    if (isValidAmount(cleanValue))
                      updateField("amount", cleanValue);
                  }}
                />
              </div>
            </div>

            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => updateField("type", "expense")}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${form.type === "expense" ? "bg-primary text-white" : "bg-border text-muted-foreground"}`}
              >
                Expense
              </button>
              <button
                onClick={() => updateField("type", "income")}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${form.type === "income" ? "bg-income text-white" : "bg-border text-muted-foreground"}`}
              >
                Income
              </button>
            </div>

            {/* Bucket Pills (expenses only) */}
            {form.type === "expense" && (
              <div className="grid grid-cols-3 gap-3">
                {BUCKET_PILLS.map((pill) => {
                  const Icon = pill.icon;
                  const isSelected = form.selectedBucket === pill.key;
                  return (
                    <button
                      key={pill.key}
                      onClick={() =>
                        updateField(
                          "selectedBucket",
                          isSelected ? null : pill.key,
                        )
                      }
                      className={`flex flex-col items-center gap-3 p-4 rounded-3xl bg-background border-2 transition-all hover:scale-[1.02] ${isSelected ? `${pill.borderColor} ${pill.textColor}` : "border-transparent text-muted-foreground hover:border-[#c97a5a]/30"}`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {pill.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Category Pills */}
            {(form.selectedBucket || form.type === "income") && (
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Category
                </Label>
                {loading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading categories...
                  </p>
                ) : filteredCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories available
                  </p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                    {filteredCategories.map((item) => {
                      const isSelected = form.categoryId === item.id;
                      const color = getCategoryColor(item.allocationBucket);
                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            updateField(
                              "categoryId",
                              isSelected ? null : item.id,
                            )
                          }
                          className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap"
                          style={{
                            borderColor: isSelected ? color : undefined,
                            color: isSelected ? color : undefined,
                            backgroundColor: isSelected
                              ? `${color}15`
                              : undefined,
                          }}
                        >
                          <span
                            className={`flex items-center gap-1.5 ${isSelected ? "" : "border-border text-muted-foreground"}`}
                          >
                            {item.icon && (
                              <span className="text-base">{item.icon}</span>
                            )}
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal rounded-2xl h-14 bg-background border border-border hover:bg-background/80"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {form.date ? (
                      <span
                        className="text-foreground"
                        suppressHydrationWarning
                      >
                        {format(parseISO(form.date), "MMMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date ? parseISO(form.date) : undefined}
                    onSelect={(day) =>
                      day && updateField("date", format(day, "yyyy-MM-dd"))
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Notes
              </Label>
              <textarea
                placeholder="Add a note about this transaction..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full bg-background border border-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none h-24 resize-none text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 text-center bg-red-400/10 p-3 rounded-xl">
                {error}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="px-6 pb-8 pt-4 border-t border-border bg-card">
            <Button
              onClick={submit}
              disabled={saving || !form.amount}
              className="w-full py-6 rounded-3xl bg-linear-to-r from-primary to-[#a36248] text-white font-bold text-lg shadow-xl shadow-[#c97a5a44] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : mode === "edit" ? "Update" : "Add"}
              <CheckCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
