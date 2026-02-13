"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";

import { api } from "@/lib/api-client";
import type { Transaction } from "@/types";
import { TransactionItem } from "@/components/transaction-item";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { formatDateGroup } from "@/lib/utils";

const BATCH_SIZE = 20;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Filter type includes allocation buckets
type FilterType = "all" | "income" | "expense" | "needs" | "wants" | "future";

function calculateDayTotal(items: Transaction[]): number {
  return items.reduce((sum, item) => {
    const amount = Number(item.amount);
    return item.type === "income" ? sum + amount : sum - amount;
  }, 0);
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const offsetRef = React.useRef(0);
  const loadingRef = React.useRef(false);
  const resetInProgressRef = React.useRef(false);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Keep ref in sync with state
  React.useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  // Load initial batch or filter change
  const load = React.useCallback(
    async (reset = false) => {
      // Prevent concurrent reset loads
      if (reset && resetInProgressRef.current) return;
      // Prevent concurrent paginated loads
      if (!reset && loadingRef.current) return;

      const newOffset = reset ? 0 : offsetRef.current;

      if (reset) {
        resetInProgressRef.current = true;
        setLoading(true);
      }
      loadingRef.current = true;

      try {
        let typeFilter: string | undefined;
        if (filter === "income") {
          typeFilter = "income";
        } else if (filter === "expense") {
          typeFilter = "expense";
        }

        const data = await api.transactions.list({
          type: typeFilter,
          limit: BATCH_SIZE,
          offset: newOffset,
          orderBy: "date_desc",
        });

        const newTransactions = data ?? [];

        if (reset) {
          setTransactions(newTransactions);
          setOffset(BATCH_SIZE);
        } else {
          setTransactions((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const uniqueNew = newTransactions.filter(
              (t: Transaction) => !existingIds.has(t.id),
            );
            return [...prev, ...uniqueNew];
          });
          setOffset(newOffset + BATCH_SIZE);
        }

        setHasMore(newTransactions.length === BATCH_SIZE);
      } finally {
        if (reset) {
          setLoading(false);
          resetInProgressRef.current = false;
        }
        loadingRef.current = false;
      }
    },
    [filter],
  );

  // Reset and reload when filter changes
  React.useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Listen for transaction changes
  React.useEffect(() => {
    const handler = () => load(true);
    window.addEventListener("transactions:changed", handler);
    return () => window.removeEventListener("transactions:changed", handler);
  }, [load]);

  // Infinite scroll with Intersection Observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          load(false);
        }
      },
      { rootMargin: "100px" },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, load]);

  function matchesBucketFilter(
    item: Transaction,
    filterType: FilterType,
  ): boolean {
    if (
      filterType === "all" ||
      filterType === "income" ||
      filterType === "expense"
    ) {
      return true;
    }
    const bucket = item.category?.allocationBucket;
    return bucket === filterType && item.type === "expense";
  }

  const filtered = transactions.filter((item) => {
    const searchText =
      `${item.description ?? ""} ${item.category?.name ?? ""}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    return matchesSearch && matchesBucketFilter(item, filter);
  });

  const grouped = filtered.reduce<Record<string, Transaction[]>>(
    (acc, item) => {
      const key = new Date(item.date).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {},
  );

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const deleteTransaction = async (id: string) => {
    await api.transactions.delete(id);
    window.dispatchEvent(new Event("transactions:changed"));
  };

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: "all", label: "All Activity" },
    { value: "needs", label: "Needs" },
    { value: "wants", label: "Wants" },
    { value: "future", label: "Future" },
    { value: "income", label: "Income" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          Review and manage your transactions.
        </p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
          <Input
            type="text"
            placeholder="Search merchants, notes, or amounts..."
            className="w-full bg-card border-border rounded-[20px] py-6 pl-12 pr-6 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[#c97a5a] focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === btn.value
                  ? "bg-[#c97a5a] text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading && transactions.length === 0 && (
        <Card className="p-6 text-center border-border bg-card">
          <p className="text-muted-foreground">Loading transactions...</p>
        </Card>
      )}

      {sortedDates.length === 0 && !loading && (
        <Card className="p-6 text-center border-border bg-card">
          <p className="text-muted-foreground">No transactions found.</p>
        </Card>
      )}

      <div className="space-y-8">
        {sortedDates.map((date) => {
          const items = grouped[date];
          const dayTotal = calculateDayTotal(items);

          return (
            <section key={date} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {formatDateGroup(date)}
                </h2>
                <span className="text-xs text-muted-foreground">
                  Total: {dayTotal >= 0 ? "+" : "-"}
                  {currency.format(Math.abs(dayTotal))}
                </span>
              </div>

              <div
                className="space-y-3"
                role="list"
                aria-label={`Transactions for ${formatDateGroup(date)}`}
              >
                {items.map((item) => (
                  <SwipeableItem
                    key={item.id}
                    onDelete={async () => {
                      await deleteTransaction(item.id);
                    }}
                    aria-label={
                      item.description || item.category?.name || "Transaction"
                    }
                  >
                    <TransactionItem transaction={item} />
                  </SwipeableItem>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div
        ref={loadMoreRef}
        className="mt-8 flex flex-col items-center justify-center py-6"
      >
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && transactions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            No more transactions to load
          </p>
        )}
      </div>
    </div>
  );
}
