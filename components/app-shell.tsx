"use client";

import * as React from "react";

import { BottomNav } from "@/components/bottom-nav";
import { SideNav } from "@/components/side-nav";
import { FloatingActionButton } from "@/components/floating-action-button";
import { TransactionSheet } from "@/components/transaction-sheet";
import { TransactionSheetProvider } from "@/components/transaction-sheet-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TransactionSheetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex w-full">
          <SideNav />
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 pb-32 md:pb-12">
            {children}
          </main>
        </div>
        <BottomNav />
        <FloatingActionButton />
        <TransactionSheet />
      </div>
    </TransactionSheetProvider>
  );
}
