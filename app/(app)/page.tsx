"use client";

import * as React from "react";
import { Home, Coffee, PiggyBank, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { api } from "@/lib/api-client";
import type { RecurringTransaction, Transaction, FinancialProfile } from "@/types";
import { AmountDisplay, CompactAmount } from "@/components/ui/amount-display";
import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { TransactionItem } from "@/components/transaction-item";
import type { InsightsData } from "@/types";

// Get greeting based on local time
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}

// 50/30/20 Harmony Card Component
function HarmonyCard({
  title,
  amount,
  total,
  icon: Icon,
  color,
  percentage,
}: {
  title: string;
  amount: number;
  total: number;
  icon: React.ElementType;
  color: string;
  percentage: number;
}) {
  const progress = Math.min((amount / total) * 100, 100);
  const remaining = Math.max(total - amount, 0);

  return (
    <div className="min-w-65 w-full max-w-75 sm:w-70 shrink-0 bg-card border border-border rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center text-${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-semibold text-sm uppercase text-${color}`}>{title}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
        <CompactAmount amount={amount} className="text-xl sm:text-2xl font-bold truncate" />
        <span className="text-xs sm:text-sm text-muted-foreground">/ <CompactAmount amount={total} /></span>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-${color}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{percentage}%</span>
        <span className={`text-xs font-medium text-${color}`}><CompactAmount amount={remaining} /> left</span>
      </div>
    </div>
  );
}

// Calculate spending by bucket from transactions (@vercel js-combine-iterations)
function calculateBucketSpending(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, t) => {
    if (t.type !== "expense") return acc;
    const bucket = t.category?.allocationBucket;
    if (bucket) acc[bucket] = (acc[bucket] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);
}

// Dashboard state interface
interface DashboardState {
  insights: InsightsData | null;
  recent: Transaction[];
  upcoming: RecurringTransaction[];
  profile: FinancialProfile | null;
  loading: boolean;
}

export default function DashboardPage() {
  // Consolidated state (@vercel rerender-derived-state-no-effect)
  const [state, setState] = React.useState<DashboardState>({
    insights: null,
    recent: [],
    upcoming: [],
    profile: null,
    loading: true,
  });

  const load = React.useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const [insights, recent, upcoming, profile] = await Promise.all([
        api.insights.get(),
        api.transactions.list({ limit: 5, orderBy: "date_desc" }),
        api.recurring.list(),
        api.financialProfile.get().catch(() => null),
      ]);
      setState({ insights, recent: recent ?? [], upcoming: upcoming ?? [], profile, loading: false });
    } catch {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  React.useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("transactions:changed", handler);
    return () => window.removeEventListener("transactions:changed", handler);
  }, [load]);

  // Derive all computed values during render (@vercel rerender-derived-state-no-effect)
  const { insights, recent, upcoming, profile, loading } = state;
  const balance = insights?.balance ?? 0;
  const income = insights?.totalIncome ?? 4200;
  const expenses = insights?.totalExpenses ?? 0;

  // Get percentages from profile or use defaults (50/30/20)
  const needsPercentage = Number(profile?.needsPercentage ?? 50);
  const wantsPercentage = Number(profile?.wantsPercentage ?? 30);
  const futurePercentage = Number(profile?.futurePercentage ?? 20);

  // Calculate allocations
  const needsTotal = income * (needsPercentage / 100);
  const wantsTotal = income * (wantsPercentage / 100);
  const futureTotal = income * (futurePercentage / 100);

  // Calculate spending by bucket (single pass)
  const bucketSpending = React.useMemo(() => calculateBucketSpending(recent), [recent]);

  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0];
  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {userName ? `${greeting}, ${userName}` : greeting}
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Balance Card */}
      <div className="bg-linear-to-r from-[#c97a5a] to-[#a36248] rounded-3xl p-6 text-white shadow-[0_8px_30px_rgba(201,122,90,0.3)]">
        <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">
          Current Balance
        </p>
        {/* Mobile: compact notation, Desktop: full notation */}
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          <CompactAmount amount={balance} />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1 text-white/70">
            Income{" "}
            <span className="text-green-200">
              <AmountDisplay amount={income} sign="always" />
            </span>
          </span>
          <span className="flex items-center gap-1 text-white/70">
            Expenses{" "}
            <span className="text-orange-100">
              <AmountDisplay amount={-expenses} sign="always" />
            </span>
          </span>
        </div>
      </div>

      {/* 50/30/20 Harmony Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Budget Harmony</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          <HarmonyCard
            title="Needs"
            amount={bucketSpending.needs ?? 0}
            total={needsTotal}
            icon={Home}
            color="needs"
            percentage={needsPercentage}
          />
          <HarmonyCard
            title="Wants"
            amount={bucketSpending.wants ?? 0}
            total={wantsTotal}
            icon={Coffee}
            color="wants"
            percentage={wantsPercentage}
          />
          <HarmonyCard
            title="Future"
            amount={bucketSpending.future ?? 0}
            total={futureTotal}
            icon={PiggyBank}
            color="future"
            percentage={futurePercentage}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link
            href="/transactions"
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3" role="list" aria-label="Recent transactions">
          {recent.length === 0 && !loading ? (
            <Card className="p-6 text-center border-border bg-card">
              <p className="text-muted-foreground mb-4">No transactions yet.</p>
              <p className="text-sm text-muted-foreground">
                Add your first transaction to start tracking.
              </p>
            </Card>
          ) : (
            recent.filter(Boolean).map((transaction, index) => (
              <SwipeableItem
                key={transaction?.id || `tx-${index}`}
                onDelete={async () => {
                  if (transaction?.id) {
                    await api.transactions.delete(transaction.id);
                    window.dispatchEvent(new Event("transactions:changed"));
                  }
                }}
                aria-label={transaction?.description || "Transaction"}
              >
                <TransactionItem transaction={transaction} />
              </SwipeableItem>
            ))
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming</h2>
        <div className="space-y-3">
          {upcoming.length === 0 && !loading ? (
            <Card className="p-6 text-center border-border bg-card">
              <p className="text-muted-foreground">
                No recurring transactions yet.
              </p>
            </Card>
          ) : (
            upcoming.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 rounded-3xl bg-card border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-border flex items-center justify-center text-muted-foreground">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-foreground">
                      {item.description || item.category?.name || "Recurring"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Next: {new Date(item.nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={
                    item.type === "income" ? "text-income" : "text-expense"
                  }
                >
                  <span className="font-bold text-xl">
                    <AmountDisplay
                      amount={
                        item.type === "income"
                          ? Number(item.amount)
                          : -Number(item.amount)
                      }
                      sign="always"
                    />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
