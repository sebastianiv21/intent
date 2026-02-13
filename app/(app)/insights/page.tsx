"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { api } from "@/lib/api-client";
import type {
  AllocationSummary,
  InsightsData,
  FinancialProfile,
} from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

const COLORS = {
  needs: "#8b9a7e",
  wants: "#c97a5a",
  future: "#a89562",
  income: "#6b9a8c",
  expense: "#c97a5a",
};

const BUCKET_LABELS = {
  needs: "Needs",
  wants: "Wants",
  future: "Future",
};

const ranges = [
  { label: "This Month", value: "month" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "Year", value: "year" },
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export default function InsightsPage() {
  const [range, setRange] =
    React.useState<(typeof ranges)[number]["value"]>("month");
  const [insights, setInsights] = React.useState<InsightsData | null>(null);
  const [allocation, setAllocation] = React.useState<AllocationSummary | null>(
    null,
  );
  const [profile, setProfile] = React.useState<FinancialProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [insightsData, allocationData, profileData] = await Promise.all([
          api.insights.get(range),
          api.insights.allocationSummary(format(new Date(), "yyyy-MM")),
          api.financialProfile.get(),
        ]);
        setInsights(insightsData);
        setAllocation(allocationData);
        setProfile(profileData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load insights",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  // Calculate user's actual allocation percentages for display
  const allocationText = React.useMemo(() => {
    if (!profile) return "50/30/20";
    const needs = Math.round(parseFloat(profile.needsPercentage));
    const wants = Math.round(parseFloat(profile.wantsPercentage));
    const future = Math.round(parseFloat(profile.futurePercentage));
    return `${needs}/${wants}/${future}`;
  }, [profile]);

  // Calculate savings rate
  const savingsRate = React.useMemo(() => {
    if (!insights || insights.totalIncome === 0) return 0;
    return (
      ((insights.totalIncome - insights.totalExpenses) / insights.totalIncome) *
      100
    );
  }, [insights]);

  // Calculate per-bucket compliance
  const bucketCompliance = React.useMemo(() => {
    if (!allocation) return null;
    return {
      needs:
        allocation.targets.needs > 0
          ? Math.min(
              100,
              Math.round(
                (allocation.actual.needs / allocation.targets.needs) * 100,
              ),
            )
          : 0,
      wants:
        allocation.targets.wants > 0
          ? Math.min(
              100,
              Math.round(
                (allocation.actual.wants / allocation.targets.wants) * 100,
              ),
            )
          : 0,
      future:
        allocation.targets.future > 0
          ? Math.min(
              100,
              Math.round(
                (allocation.actual.future / allocation.targets.future) * 100,
              ),
            )
          : 0,
    };
  }, [allocation]);

  // Income vs Expenses data
  const incomeExpenseData = React.useMemo(() => {
    if (!insights) return [];
    return [
      { name: "Income", value: insights.totalIncome, fill: COLORS.income },
      { name: "Expenses", value: insights.totalExpenses, fill: COLORS.expense },
    ];
  }, [insights]);

  // Allocation spending data for pie chart
  const allocationPieData = React.useMemo(() => {
    if (!allocation) return [];
    return [
      { name: "Needs", value: allocation.actual.needs, color: COLORS.needs },
      { name: "Wants", value: allocation.actual.wants, color: COLORS.wants },
      { name: "Future", value: allocation.actual.future, color: COLORS.future },
    ].filter((d) => d.value > 0);
  }, [allocation]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Insights" />
        <Card className="p-6">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        subtitle={`Track progress toward your ${allocationText} goals.`}
      />

      <Tabs
        value={range}
        onValueChange={(value) => setRange(value as typeof range)}
      >
        <TabsList className="w-full">
          {ranges.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="flex-1">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-28 animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {!loading && insights && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Savings Rate */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Savings Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {formatPercentage(savingsRate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {savingsRate >= 20
                    ? "Great job! You're saving more than 20%"
                    : savingsRate >= 10
                      ? "Good progress toward 20% target"
                      : "Aim to save at least 20% of income"}
                </p>
              </CardContent>
            </Card>

            {/* Total Income */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Income</CardDescription>
                <CardTitle className="text-3xl text-income">
                  {formatCurrency(insights.totalIncome)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {insights.transactionCount} transactions
                </p>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-3xl text-expense">
                  {formatCurrency(insights.totalExpenses)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(
                    (insights.totalExpenses /
                      Math.max(insights.totalIncome, 1)) *
                      100,
                  )}{" "}
                  of income
                </p>
              </CardContent>
            </Card>

            {/* Net Balance */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Net Balance</CardDescription>
                <CardTitle
                  className={`text-3xl ${insights.balance >= 0 ? "text-income" : "text-expense"}`}
                >
                  {formatCurrency(insights.balance)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {insights.balance >= 0
                    ? "Positive cash flow"
                    : "Spending exceeds income"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Progress Cards */}
          {allocation && bucketCompliance && (
            <div className="grid gap-4 md:grid-cols-3">
              {(["needs", "wants", "future"] as const).map((bucket) => {
                const target = allocation.targets[bucket];
                const actual = allocation.actual[bucket];
                const compliance = bucketCompliance[bucket];
                const isOver = actual > target && target > 0;

                return (
                  <Card key={bucket}>
                    <CardHeader className="pb-2">
                      <CardDescription>{BUCKET_LABELS[bucket]}</CardDescription>
                      <div className="flex items-baseline justify-between">
                        <CardTitle className="text-2xl">
                          {formatCurrency(actual)}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          of {formatCurrency(target)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, compliance)}%`,
                            backgroundColor: isOver
                              ? "#ef4444"
                              : COLORS[bucket],
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            isOver ? "text-red-500" : "text-muted-foreground"
                          }
                        >
                          {isOver
                            ? `${formatPercentage(compliance)} (over budget)`
                            : `${formatPercentage(compliance)} used`}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(Math.max(0, target - actual))}{" "}
                          remaining
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Allocation Pie Chart */}
            {allocationPieData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Spending by Allocation
                  </CardTitle>
                  <CardDescription>
                    How your spending breaks down across buckets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                        >
                          {allocationPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            typeof value === "number"
                              ? formatCurrency(value)
                              : value
                          }
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-4">
                    {allocationPieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Income vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Income vs Expenses</CardTitle>
                <CardDescription>
                  Compare what you earned vs what you spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incomeExpenseData} barSize={60}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) =>
                          typeof value === "number"
                            ? formatCurrency(value)
                            : value
                        }
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {incomeExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          {insights.spendingByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Spending by Category
                </CardTitle>
                <CardDescription>
                  Top categories where your money went
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={insights.spendingByCategory.slice(0, 8)}
                      layout="vertical"
                      margin={{ left: 24, right: 24 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) =>
                          typeof value === "number"
                            ? formatCurrency(value)
                            : value
                        }
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#c97a5a"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!loading && !insights && !error && (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            No insights data available.
          </p>
        </Card>
      )}
    </div>
  );
}
