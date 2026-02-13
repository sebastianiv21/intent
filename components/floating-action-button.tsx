"use client";

import { Plus } from "lucide-react";

import { useTransactionSheet } from "@/components/transaction-sheet-context";

export function FloatingActionButton() {
  const { openForCreate } = useTransactionSheet();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <button
        type="button"
        onClick={openForCreate}
        className="relative -top-2 w-14 h-14 rounded-full bg-linear-to-br from-[#c97a5a] to-[#a36248] shadow-[0_4px_20px_rgba(201,122,90,0.4)] flex items-center justify-center text-white transition-transform active:scale-95 hover:scale-105"
        aria-label="Add transaction"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}
