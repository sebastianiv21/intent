import { Home, Coffee, PiggyBank } from "lucide-react";

export const BUCKETS = [
  {
    key: "needs" as const,
    label: "Needs",
    icon: Home,
    color: "#8b9a7e",
    textColor: "text-needs",
  },
  {
    key: "wants" as const,
    label: "Wants",
    icon: Coffee,
    color: "#c97a5a",
    textColor: "text-wants",
  },
  {
    key: "future" as const,
    label: "Future",
    icon: PiggyBank,
    color: "#a89562",
    textColor: "text-future",
  },
];

export type BucketKey = typeof BUCKETS[number]["key"];

// Format number with thousand separators for display
export function formatNumberWithCommas(value: string): string {
  if (!value) return "";
  const [whole, decimal] = value.split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
}

// Remove all non-numeric characters except decimal point
export function cleanNumber(value: string): string {
  return value.replace(/[^\d.]/g, "");
}
