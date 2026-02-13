"use client";

import * as React from "react";
import {
  Home,
  Coffee,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Pencil,
} from "lucide-react";

import { api } from "@/lib/api-client";
import type { Budget, Category, Transaction } from "@/types";
import { CompactAmount } from "@/components/ui/amount-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Bucket configuration with colors and icons
const BUCKETS = {
  needs: {
    label: "Essential Living",
    subtitle: "Needs",
    percentage: 50,
    color: "#8b9a7e",
    bgColor: "bg-[#8b9a7e]",
    lightBg: "bg-[#8b9a7e]/20",
    icon: Home,
  },
  wants: {
    label: "Life's Joy",
    subtitle: "Wants",
    percentage: 30,
    color: "#c97a5a",
    bgColor: "bg-[#c97a5a]",
    lightBg: "bg-[#c97a5a]/20",
    icon: Coffee,
  },
  future: {
    label: "Future Freedom",
    subtitle: "Future",
    percentage: 20,
    color: "#a89562",
    bgColor: "bg-[#a89562]",
    lightBg: "bg-[#a89562]/20",
    icon: PiggyBank,
  },
};

type BucketKey = keyof typeof BUCKETS;

// Calculate spent amount for a bucket
function calculateSpent(
  bucket: BucketKey,
  transactions: Transaction[],
): number {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return (
        t.type === "expense" &&
        t.category?.allocationBucket === bucket &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

// Budget Section Component
function BudgetSection({
  bucketKey,
  totalIncome,
  categories,
  budgets,
  spent,
  onEdit,
}: {
  bucketKey: BucketKey;
  totalIncome: number;
  categories: Category[];
  budgets: Budget[];
  spent: number;
  onEdit: (budget: Budget) => void;
}) {
  const config = BUCKETS[bucketKey];
  const Icon = config.icon;
  const allocation = totalIncome * (config.percentage / 100);
  const progress = Math.min((spent / allocation) * 100, 100);
  const remaining = Math.max(allocation - spent, 0);
  const isComplete = spent >= allocation;

  const bucketCategories = categories.filter(
    (c) => c.allocationBucket === bucketKey,
  );
  const bucketBudgets = budgets.filter((b) =>
    bucketCategories.some((c) => c.id === b.categoryId),
  );

  return (
    <section className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${config.lightBg} flex items-center justify-center`}
            style={{ color: config.color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {config.label} ({config.subtitle})
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">
              Allocation: {config.percentage}% (
              <CompactAmount amount={allocation} />)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">
            <CompactAmount amount={spent} />
            <span className="text-xs text-muted-foreground font-normal">
              / <CompactAmount amount={allocation} />
            </span>
          </p>
          <p
            className={`text-[10px] font-bold uppercase ${isComplete ? "text-[#9fb89f]" : "text-[#9fb89f]"}`}
          >
            <CompactAmount amount={remaining} /> Left
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-card rounded-full overflow-hidden border border-border">
        <div
          className={`h-full rounded-full ${config.bgColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {bucketBudgets.length === 0 ? (
          <div
            className={`col-span-full p-5 rounded-2xl bg-card border border-border border-l-4 text-center`}
            style={{ borderLeftColor: config.color }}
          >
            <p className="text-sm text-muted-foreground">
              No budgets set for {config.label.toLowerCase()} yet.
            </p>
          </div>
        ) : (
          bucketBudgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const categorySpent =
              spent * (Number(budget.amount) / allocation || 0); // Estimate based on proportion

            return (
              <div
                key={budget.id}
                className="bg-card p-5 rounded-2xl border border-border flex justify-between items-center hover:border-[#c97a5a]/30 transition-all cursor-pointer"
                onClick={() => onEdit(budget)}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {category?.name || "Uncategorized"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <CompactAmount amount={categorySpent} /> of{" "}
                    <CompactAmount amount={Number(budget.amount)} />
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Budget | null>(null);
  const [amount, setAmount] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [period, setPeriod] = React.useState<"monthly" | "weekly">("monthly");
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );

  // Month selector state
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [budgetData, categoryData, transactionData] = await Promise.all([
        api.budgets.list(),
        api.categories.list("expense"),
        api.transactions.list({ limit: 100, offset: 0 }),
      ]);
      setBudgets(budgetData ?? []);
      setCategories(categoryData ?? []);
      setTransactions(transactionData ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalIncome = 4200; // Placeholder - would come from API
  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const remaining = totalIncome - totalSpent;
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const currentDay = new Date().getDate();
  const daysLeft = daysInMonth - currentDay;

  const openEditor = (budget?: Budget) => {
    setEditing(budget ?? null);
    setAmount(budget?.amount ?? "");
    setCategoryId(budget?.categoryId ?? "");
    setPeriod(budget?.period ?? "monthly");
    setStartDate(
      budget?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    );
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      amount,
      categoryId: categoryId || null,
      period,
      startDate,
    };
    if (editing) {
      await api.budgets.update(editing.id, payload);
    } else {
      await api.budgets.create(payload);
    }
    setOpen(false);
    await load();
  };

  const changeMonth = (delta: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Budget Harmony
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Tracking your 50/30/20 intentional spending flow.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3 bg-card p-1 rounded-2xl border border-border">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-border transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-4 py-2 text-sm font-bold">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-border transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Top Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-[24px] border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Total Income
          </p>
          <CompactAmount
            amount={totalIncome}
            className="text-xl sm:text-2xl font-bold"
          />
        </div>
        <div className="bg-card p-5 rounded-3xl border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Remaining
          </p>
          <CompactAmount
            amount={remaining}
            className="text-xl sm:text-2xl font-bold text-[#9fb89f]"
          />
        </div>
        <div className="bg-card p-5 rounded-3xl border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Days Left
          </p>
          <p className="text-2xl font-bold">{daysLeft} Days</p>
        </div>
        <div className="bg-card p-5 rounded-3xl border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Zen Score
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">94</p>
            <Flame className="w-5 h-5 text-[#c97a5a]" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && budgets.length === 0 && (
        <Card className="p-6 text-center border-border bg-card">
          <p className="text-muted-foreground">Loading budgets...</p>
        </Card>
      )}

      {/* 50/30/20 Detailed Sections */}
      <div className="space-y-10">
        {(Object.keys(BUCKETS) as BucketKey[]).map((bucket) => (
          <BudgetSection
            key={bucket}
            bucketKey={bucket}
            totalIncome={totalIncome}
            categories={categories}
            budgets={budgets}
            spent={calculateSpent(bucket, transactions)}
            onEdit={openEditor}
          />
        ))}
      </div>

      {/* New Budget Button */}
      <div className="pt-4">
        <Button
          onClick={() => openEditor()}
          className="w-full py-6 rounded-2xl bg-gradient-to-br from-[#c97a5a] to-[#a36248] text-white font-bold text-lg shadow-lg hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Budget
        </Button>
      </div>

      {/* Budget Editor Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-[32px] border border-border"
        >
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Budget" : "New Budget"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon ? `${category.icon} ` : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0.00"
                className="rounded-2xl"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select
                value={period}
                onValueChange={(value) =>
                  setPeriod(value as "monthly" | "weekly")
                }
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                className="rounded-2xl"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                className="flex-1 rounded-2xl py-5"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 rounded-2xl py-5" onClick={save}>
                Save Budget
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
