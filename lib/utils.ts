import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cache formatters for performance (@vercel js-cache-function-results)
const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string, digits: number): Intl.NumberFormat {
  const key = `${locale}:${currency}:${digits}`;
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: digits }));
  }
  return formatters.get(key)!;
}

/**
 * Format a number in compact notation for mobile displays
 * e.g., 1200000000 → "$1.2B", 45000000 → "$45M", 890000 → "$890K"
 */
export function formatCompact(value: number, currency: string = "USD", locale: string = "en-US"): string {
  if (value === 0) return getFormatter(locale, currency, 0).format(0);

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // Format with suffix based on magnitude
  if (abs >= 1_000_000_000) {
    const formatted = getFormatter(locale, currency, 1).format(abs / 1_000_000_000);
    return `${sign}${formatted.replace(/[\s$]/g, "")}B`;
  }
  if (abs >= 1_000_000) {
    const formatted = getFormatter(locale, currency, 1).format(abs / 1_000_000);
    return `${sign}${formatted.replace(/[\s$]/g, "")}M`;
  }
  if (abs >= 1_000) {
    const formatted = getFormatter(locale, currency, 0).format(abs / 1_000);
    return `${sign}${formatted.replace(/[\s$]/g, "")}K`;
  }

  return getFormatter(locale, currency, 0).format(value);
}

/**
 * Format a date group label (Today, Yesterday, or Month Day)
 */
export function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

/**
 * Get font size class based on text length for responsive scaling
 */
export function getFontSizeClass(length: number): string {
  if (length > 14) return "text-lg md:text-xl";
  if (length > 11) return "text-xl md:text-2xl";
  if (length > 8) return "text-2xl md:text-3xl";
  if (length > 5) return "text-3xl md:text-4xl";
  return "text-4xl md:text-5xl";
}

/**
 * Format number with thousand separators for display
 * e.g., "1234.56" → "1,234.56"
 */
export function formatNumberWithCommas(value: string): string {
  if (!value) return "";
  const [whole, decimal] = value.split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
}

/**
 * Remove all non-numeric characters except decimal point
 */
export function cleanNumber(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

/**
 * Validate amount string (max 2 decimal places)
 */
export function isValidAmount(value: string): boolean {
  return value === "" || /^\d*\.?\d{0,2}$/.test(value);
}
