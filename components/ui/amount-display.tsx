"use client";

import { formatCompact } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface AmountDisplayProps {
  amount: number;
  className?: string;
  sign?: "auto" | "always" | "never";
}

/**
 * Responsive amount display that shows compact notation on mobile
 * and full currency format on desktop.
 */
export function AmountDisplay({ amount, className = "", sign = "auto" }: AmountDisplayProps) {
  const isPositive = amount >= 0;
  const signChar = sign === "always" ? (isPositive ? "+" : "-") : sign === "auto" && !isPositive ? "-" : "";
  const absAmount = Math.abs(amount);

  return (
    <span className={className} title={currency.format(amount)}>
      {signChar}
      <span className="sm:hidden">{formatCompact(absAmount)}</span>
      <span className="hidden sm:inline">{currency.format(absAmount)}</span>
    </span>
  );
}

interface CompactAmountProps {
  amount: number;
  className?: string;
}

/**
 * Simple compact amount display for consistent formatting.
 */
export function CompactAmount({ amount, className = "" }: CompactAmountProps) {
  return (
    <span className={className} title={currency.format(amount)}>
      <span className="sm:hidden">{formatCompact(amount)}</span>
      <span className="hidden sm:inline">{currency.format(amount)}</span>
    </span>
  );
}
