"use client";

import * as React from "react";
import { X, CheckCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/api-client";
import type { FinancialProfile } from "@/types";
import { getFontSizeClass, cn } from "@/lib/utils";
import {
  BUCKETS,
  formatNumberWithCommas,
  cleanNumber,
  type BucketKey,
} from "@/lib/finance-utils";

interface FinancialProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FinancialProfile | null;
  onSuccess: () => void;
}

export function FinancialProfileSheet({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: FinancialProfileSheetProps) {
  const [monthlyIncome, setMonthlyIncome] = React.useState(
    profile?.monthlyIncomeTarget ? Number(profile.monthlyIncomeTarget) : 0
  );
  const [needsPct, setNeedsPct] = React.useState(
    profile ? Number(profile.needsPercentage) : 50
  );
  const [wantsPct, setWantsPct] = React.useState(
    profile ? Number(profile.wantsPercentage) : 30
  );
  const [futurePct, setFuturePct] = React.useState(
    profile ? Number(profile.futurePercentage) : 20
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset values when profile changes or sheet opens
  React.useEffect(() => {
    if (open && profile) {
      setMonthlyIncome(Number(profile.monthlyIncomeTarget));
      setNeedsPct(Number(profile.needsPercentage));
      setWantsPct(Number(profile.wantsPercentage));
      setFuturePct(Number(profile.futurePercentage));
      setError(null);
    }
  }, [open, profile]);

  const incomeString = monthlyIncome > 0 ? monthlyIncome.toString() : "";
  const totalPercentage = needsPct + wantsPct + futurePct;
  const isValid = totalPercentage === 100;

  const setters: Record<BucketKey, React.Dispatch<React.SetStateAction<number>>> = {
    needs: setNeedsPct,
    wants: setWantsPct,
    future: setFuturePct,
  };

  const adjustPercentage = (key: BucketKey, delta: number) => {
    const setPercentage = setters[key];
    setPercentage((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  const handleSave = async () => {
    if (!isValid || monthlyIncome <= 0) return;

    setIsSaving(true);
    setError(null);

    try {
      await api.financialProfile.update({
        monthlyIncomeTarget: Math.round(monthlyIncome),
        needsPercentage: needsPct,
        wantsPercentage: wantsPct,
        futurePercentage: futurePct,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const needsAmount = monthlyIncome * (needsPct / 100);
  const wantsAmount = monthlyIncome * (wantsPct / 100);
  const futureAmount = monthlyIncome * (futurePct / 100);

  const amounts = { needs: needsAmount, wants: wantsAmount, future: futureAmount };
  const percentages = { needs: needsPct, wants: wantsPct, future: futurePct };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                Edit Budget
              </SheetTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Monthly Income Input */}
            <div className="space-y-2 text-center">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Monthly Income
              </Label>
              <div className="relative flex items-center justify-center group overflow-hidden">
                <span
                  className={cn(
                    "font-extrabold text-primary mr-2 font-mono transition-all duration-200",
                    getFontSizeClass(formatNumberWithCommas(incomeString).length)
                  )}
                >
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9,]*"
                  placeholder="0"
                  autoFocus
                  className={cn(
                    "bg-transparent border-none text-center font-extrabold font-mono focus:outline-none focus:ring-0 w-full placeholder:text-muted-foreground/20 text-foreground p-0 transition-all duration-200",
                    getFontSizeClass(formatNumberWithCommas(incomeString).length)
                  )}
                  value={formatNumberWithCommas(incomeString)}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const cleanValue = cleanNumber(rawValue);
                    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
                      setMonthlyIncome(cleanValue === "" ? 0 : Number(cleanValue));
                    }
                  }}
                />
              </div>
            </div>

            {/* Allocation Rows */}
            <div className="space-y-3">
              {BUCKETS.map((bucket) => {
                const Icon = bucket.icon;
                const amount = amounts[bucket.key];
                const percentage = percentages[bucket.key];

                return (
                  <div
                    key={bucket.key}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border"
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${bucket.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: bucket.color }} />
                    </div>

                    {/* Label & Amount */}
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold text-sm", bucket.textColor)}>
                        {bucket.label}
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustPercentage(bucket.key, -5)}
                        disabled={percentage <= 0}
                        className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-foreground hover:bg-border/80 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-sm">
                        {percentage}%
                      </span>
                      <button
                        onClick={() => adjustPercentage(bucket.key, 5)}
                        disabled={percentage >= 100}
                        className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-foreground hover:bg-border/80 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Indicator */}
            <div className={cn(
              "text-center text-sm font-medium py-2 px-4 rounded-xl",
              isValid 
                ? "text-needs bg-needs/10" 
                : "text-destructive bg-destructive/10"
            )}>
              Total: {totalPercentage}% {isValid ? "✓" : `(needs to be 100%)`}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-xl">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-8 pt-4 border-t border-border bg-card">
            <Button
              onClick={handleSave}
              disabled={isSaving || !isValid || monthlyIncome <= 0}
              className="w-full py-6 rounded-3xl bg-linear-to-r from-primary to-[#a36248] text-white font-bold text-lg shadow-xl shadow-primary/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Budget"}
              <CheckCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
