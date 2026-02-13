"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function OnboardingPage() {
  const router = useRouter();
  const [income, setIncome] = React.useState("");
  const [needs, setNeeds] = React.useState(50);
  const [wants, setWants] = React.useState(30);
  const [future, setFuture] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rebalance = (target: "needs" | "wants" | "future", value: number) => {
    const nextValue = clamp(value);
    const totals = { needs, wants, future };
    totals[target] = nextValue;
    const remaining = 100 - nextValue;
    const others = (Object.keys(totals) as Array<"needs" | "wants" | "future">).filter(
      (key) => key !== target,
    );
    const currentOtherTotal = others.reduce((sum, key) => sum + totals[key], 0);
    if (currentOtherTotal === 0) {
      const split = Math.floor(remaining / others.length);
      const remainder = remaining - split * others.length;
      totals[others[0]] = split + remainder;
      totals[others[1]] = split;
    } else {
      let allocated = 0;
      others.forEach((key, index) => {
        if (index === others.length - 1) {
          totals[key] = remaining - allocated;
          return;
        }
        const portion = Math.round((totals[key] / currentOtherTotal) * remaining);
        totals[key] = portion;
        allocated += portion;
      });
    }
    setNeeds(totals.needs);
    setWants(totals.wants);
    setFuture(totals.future);
  };

  const isValid = needs + wants + future === 100 && Number(income) > 0;

  const submit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await api.financialProfile.create({
        monthlyIncomeTarget: Number(income),
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
      <Card className="p-5">
        <div className="space-y-2">
          <Label htmlFor="income">What&apos;s your monthly income?</Label>
          <Input
            id="income"
            inputMode="decimal"
            placeholder="0.00"
            value={income}
            onChange={(event) => setIncome(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This helps us calculate your spending buckets.
          </p>
        </div>
      </Card>
      <Card className="p-5">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Needs ({needs}%)</Label>
              <span className="text-xs text-muted-foreground">Target 50%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={needs}
              onChange={(event) => rebalance("needs", Number(event.target.value))}
              className="w-full accent-[color:var(--chart-1)]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Wants ({wants}%)</Label>
              <span className="text-xs text-muted-foreground">Target 30%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={wants}
              onChange={(event) => rebalance("wants", Number(event.target.value))}
              className="w-full accent-[color:var(--chart-2)]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Future ({future}%)</Label>
              <span className="text-xs text-muted-foreground">Target 20%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={future}
              onChange={(event) => rebalance("future", Number(event.target.value))}
              className="w-full accent-[color:var(--chart-3)]"
            />
          </div>
          {needs + wants + future !== 100 ? (
            <p className="text-sm text-red-400">Total must equal 100%.</p>
          ) : null}
        </div>
      </Card>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button
        className="w-full"
        onClick={submit}
        disabled={!isValid || loading}
      >
        {loading ? "Saving..." : "Complete Setup"}
      </Button>
    </div>
  );
}
