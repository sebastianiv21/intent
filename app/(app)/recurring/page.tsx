"use client";

import * as React from "react";

import { api } from "@/lib/api-client";
import type { Category, RecurringTransaction } from "@/types";
import { AmountDisplay } from "@/components/ui/amount-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

const frequencies = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
] as const;

export default function RecurringPage() {
  const [recurring, setRecurring] = React.useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [filter, setFilter] = React.useState<"active" | "paused">("active");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<RecurringTransaction | null>(
    null,
  );
  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = React.useState("");
  const [frequency, setFrequency] =
    React.useState<(typeof frequencies)[number]>("monthly");
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = React.useState("");
  const [description, setDescription] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [recurringData, categoryData] = await Promise.all([
        api.recurring.list(),
        api.categories.list(),
      ]);
      setRecurring(recurringData ?? []);
      setCategories(categoryData ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openEditor = (item?: RecurringTransaction) => {
    setEditing(item ?? null);
    setAmount(item?.amount ?? "");
    setType(item?.type ?? "expense");
    setCategoryId(item?.categoryId ?? "");
    setFrequency(item?.frequency ?? "monthly");
    setStartDate(
      item?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    );
    setEndDate(item?.endDate?.slice(0, 10) ?? "");
    setDescription(item?.description ?? "");
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      amount,
      type,
      categoryId: categoryId || null,
      frequency,
      startDate,
      endDate: endDate || null,
      description: description || null,
      isActive: true,
    };
    if (editing) {
      await api.recurring.update(editing.id, payload);
    } else {
      await api.recurring.create(payload);
    }
    setOpen(false);
    await load();
  };

  const toggle = async (item: RecurringTransaction) => {
    await api.recurring.update(item.id, { isActive: !item.isActive });
    await load();
  };

  const filtered = recurring.filter((item) =>
    filter === "active" ? item.isActive : !item.isActive,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recurring"
        subtitle="Automate repeat expenses and income."
        action={
          <Button variant="secondary" onClick={() => openEditor()}>
            New Recurring
          </Button>
        }
      />
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as "active" | "paused")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Active ({recurring.filter((item) => item.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="paused" className="flex-1">
            Paused ({recurring.filter((item) => !item.isActive).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {loading && recurring.length === 0 ? (
        <Card className="p-4 text-sm text-muted-foreground">Loading...</Card>
      ) : null}
      {filtered.length === 0 && !loading ? (
        <Card className="p-4 text-sm text-muted-foreground">
          No recurring items yet.
        </Card>
      ) : null}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">
                  {item.description ?? item.category?.name ?? "Recurring"}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {item.frequency} • Next:{" "}
                  {new Date(item.nextDueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`text-base sm:text-lg font-medium ${item.type === "income" ? "text-emerald-300" : "text-red-300"}`}
                >
                  <AmountDisplay
                    amount={
                      item.type === "income"
                        ? Number(item.amount)
                        : -Number(item.amount)
                    }
                    sign="always"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => toggle(item)}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditor(item)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-3xl border border-border"
        >
          <SheetHeader>
            <SheetTitle>{editing ? "Edit" : "New"} Recurring</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Tabs
                value={type}
                onValueChange={(value) =>
                  setType(value as "income" | "expense")
                }
              >
                <TabsList className="w-full">
                  <TabsTrigger value="expense" className="flex-1">
                    Expense
                  </TabsTrigger>
                  <TabsTrigger value="income" className="flex-1">
                    Income
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((category) => category.type === type)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon ? `${category.icon} ` : ""}
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value) =>
                  setFrequency(value as (typeof frequencies)[number])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={save}>
                Save
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
