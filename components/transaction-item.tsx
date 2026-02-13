"use client";

import type { Transaction } from "@/types";
import { AmountDisplay } from "@/components/ui/amount-display";
import { useTransactionSheet } from "@/components/transaction-sheet-context";

interface TransactionItemProps {
  transaction: Transaction;
}

// Get category color info based on bucket or type
function getCategoryInfo(transaction: Transaction) {
  if (transaction.type === "income") {
    return {
      bg: "bg-income/10" as const,
      text: "text-income" as const,
      label: "Income",
    };
  }

  const bucket = transaction.category?.allocationBucket;
  switch (bucket) {
    case "needs":
      return {
        bg: "bg-needs/10" as const,
        text: "text-needs" as const,
        label: "Needs",
      };
    case "wants":
      return {
        bg: "bg-wants/10" as const,
        text: "text-wants" as const,
        label: "Wants",
      };
    case "future":
      return {
        bg: "bg-future/10" as const,
        text: "text-future" as const,
        label: "Future",
      };
    default:
      return {
        bg: "bg-border" as const,
        text: "text-muted-foreground" as const,
        label: "Uncategorized",
      };
  }
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { openForEdit } = useTransactionSheet();

  const color = getCategoryInfo(transaction);
  const isIncome = transaction.type === "income";

  // Guard against undefined transaction
  if (!transaction) return null;

  return (
    <div
      onClick={() => openForEdit(transaction)}
      className="flex items-center justify-between p-5 rounded-3xl bg-card border border-border hover:border-[#c97a5a]/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full ${color.bg} flex items-center justify-center ${color.text} group-hover:scale-105 transition-transform text-2xl`}
        >
          {transaction.category?.icon ? (
            <span>{transaction.category.icon}</span>
          ) : (
            <span>💰</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-lg text-foreground">
            {transaction.description ||
              transaction.category?.name ||
              "Transaction"}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            • <span className={color.text}>{color.label}</span>
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-bold text-lg sm:text-xl ${isIncome ? "text-income" : "text-expense"}`}
        >
          <AmountDisplay
            amount={
              isIncome
                ? Number(transaction.amount)
                : -Number(transaction.amount)
            }
            sign="always"
          />
        </p>
      </div>
    </div>
  );
}
