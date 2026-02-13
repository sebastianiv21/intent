"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  ChevronRight,
  Home,
  Coffee,
  PiggyBank,
  Tag,
  LogOut,
  Edit3,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api-client";
import type { FinancialProfile } from "@/types";
import { FinancialProfileSheet } from "@/components/financial-profile-sheet";
import { cn } from "@/lib/utils";

// Allocation bar component for visual display
function AllocationBar({
  label,
  percentage,
  amount,
  color,
  icon: Icon,
}: {
  label: string;
  percentage: number;
  amount: number;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          color.replace("bg-", "bg-").replace("text-", "") + "/15",
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5",
            color.replace("bg-", "text-").replace("text-", "text-"),
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm font-bold text-foreground">
            ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              color,
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {percentage}% of income
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = React.useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  };

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.financialProfile.get().catch(() => null);
      setProfile(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const user = session?.user;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitial = userName[0]?.toUpperCase() || "U";

  // Calculate allocations
  const monthlyIncome = profile ? Number(profile.monthlyIncomeTarget) : 0;
  const needsPct = profile ? Number(profile.needsPercentage) : 50;
  const wantsPct = profile ? Number(profile.wantsPercentage) : 30;
  const futurePct = profile ? Number(profile.futurePercentage) : 20;

  const needsAmount = monthlyIncome * (needsPct / 100);
  const wantsAmount = monthlyIncome * (wantsPct / 100);
  const futureAmount = monthlyIncome * (futurePct / 100);

  const hasProfile = !!profile && monthlyIncome > 0;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Profile"
        subtitle="Manage your account and budget settings."
      />

      {/* User Profile Card */}
      <Card className="p-6 rounded-3xl bg-card border-border overflow-hidden relative">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-needs via-wants to-future" />

        <div className="flex items-center gap-4 pt-2">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/80 to-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {userInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border-2 border-border rounded-full flex items-center justify-center">
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">
              {userName}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        </div>
      </Card>

      {/* Financial Profile Card */}
      <Card className="rounded-3xl bg-card border-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Financial Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasProfile
                    ? `Monthly income: $${monthlyIncome.toLocaleString()}`
                    : "Set up your budget allocations"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditSheetOpen(true)}
              className="shrink-0"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-12 bg-border/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-border/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-border/50 rounded-xl animate-pulse" />
            </div>
          ) : hasProfile ? (
            <div className="space-y-4">
              <AllocationBar
                label="Needs"
                percentage={needsPct}
                amount={needsAmount}
                color="bg-needs"
                icon={Home}
              />
              <AllocationBar
                label="Wants"
                percentage={wantsPct}
                amount={wantsAmount}
                color="bg-wants"
                icon={Coffee}
              />
              <AllocationBar
                label="Future"
                percentage={futurePct}
                amount={futureAmount}
                color="bg-future"
                icon={PiggyBank}
              />
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-3">
                No financial profile set up yet.
              </p>
              <Button onClick={() => setIsEditSheetOpen(true)}>
                Set Up Budget
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Menu Navigation */}
      <Card className="rounded-3xl bg-card border-border overflow-hidden divide-y divide-border">
        <Link
          href="/categories"
          className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Tag className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-medium text-foreground">Categories</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={handleSignOut}
        className="w-full rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Intent Expense Tracker v1.0
      </p>

      {/* Edit Sheet */}
      <FinancialProfileSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        profile={profile}
        onSuccess={loadProfile}
      />
    </div>
  );
}
