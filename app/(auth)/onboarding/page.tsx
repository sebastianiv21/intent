"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";

import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  BUCKETS,
  formatNumberWithCommas,
  cleanNumber,
  type BucketKey,
} from "@/lib/finance-utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [income, setIncome] = React.useState("");
  const [needs, setNeeds] = React.useState(50);
  const [wants, setWants] = React.useState(30);
  const [future, setFuture] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const monthlyIncome = income === "" ? 0 : Number(income);
  const totalPercentage = needs + wants + future;
  const isValid = totalPercentage === 100 && monthlyIncome > 0;

  const setters: Record<BucketKey, React.Dispatch<React.SetStateAction<number>>> = {
    needs: setNeeds,
    wants: setWants,
    future: setFuture,
  };

  const adjustPercentage = (key: BucketKey, delta: number) => {
    const setPercentage = setters[key];
    setPercentage((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  const percentages = { needs, wants, future };
  const amounts = {
    needs: monthlyIncome * (needs / 100),
    wants: monthlyIncome * (wants / 100),
    future: monthlyIncome * (future / 100),
  };

  const submit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await api.financialProfile.create({
        monthlyIncomeTarget: monthlyIncome,
        needsPercentage: needs,
        wantsPercentage: wants,
        futurePercentage: future,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 pb-20 pt-10">
      <div>
        <h1 className="text-2xl font-semibold">Let&apos;s set up your budget</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll use the 50/30/20 rule to guide your spending buckets.
        </p>
      </div>

      {/* Income Input */}
      <Card className="p-5">
        <div className="space-y-3 text-center">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Monthly Income
          </Label>
          <div className="relative flex items-center justify-center">
            <span className="text-3xl font-extrabold text-primary mr-2 font-mono">
              $
            </span>
            <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9,]*"
              placeholder="0"
              autoFocus
              className="bg-transparent border-none text-center text-3xl font-extrabold font-mono focus:outline-none focus:ring-0 w-full placeholder:text-muted-foreground/20 text-foreground p-0"
              value={formatNumberWithCommas(income)}
              onChange={(e) => {
                const rawValue = e.target.value;
                const cleanValue = cleanNumber(rawValue);
                if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
                  setIncome(cleanValue);
                }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This helps us calculate your spending buckets.
          </p>
        </div>
      </Card>

      {/* Allocation Buckets */}
      <Card className="p-5">
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
          "text-center text-sm font-medium py-2 px-4 rounded-xl mt-4",
          totalPercentage === 100
            ? "text-needs bg-needs/10"
            : "text-destructive bg-destructive/10"
        )}>
          Total: {totalPercentage}% {totalPercentage === 100 ? "✓" : "(needs to be 100%)"}
        </div>
      </Card>

      {error ? (
        <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-xl">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full py-6 rounded-3xl font-bold text-lg"
        onClick={submit}
        disabled={!isValid || loading}
      >
        {loading ? "Saving..." : "Complete Setup"}
      </Button>
    </div>
  );
}
