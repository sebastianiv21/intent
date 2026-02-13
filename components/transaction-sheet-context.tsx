"use client";

import * as React from "react";
import type { Transaction } from "@/types";

interface TransactionSheetContextValue {
  open: boolean;
  mode: "create" | "edit";
  transaction: Transaction | null;
  openForCreate: () => void;
  openForEdit: (transaction: Transaction) => void;
  close: () => void;
}

const TransactionSheetContext = React.createContext<
  TransactionSheetContextValue | undefined
>(undefined);

export function TransactionSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [transaction, setTransaction] = React.useState<Transaction | null>(null);

  const openForCreate = React.useCallback(() => {
    setMode("create");
    setTransaction(null);
    setOpen(true);
  }, []);

  const openForEdit = React.useCallback((next: Transaction) => {
    setMode("edit");
    setTransaction(next);
    setOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <TransactionSheetContext.Provider
      value={{ open, mode, transaction, openForCreate, openForEdit, close }}
    >
      {children}
    </TransactionSheetContext.Provider>
  );
}

export function useTransactionSheet() {
  const context = React.useContext(TransactionSheetContext);
  if (!context) {
    throw new Error(
      "useTransactionSheet must be used within TransactionSheetProvider",
    );
  }
  return context;
}
