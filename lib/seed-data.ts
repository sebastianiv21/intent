export const DEFAULT_CATEGORIES = [
  // Needs (50%)
  { name: "Rent/Mortgage", type: "expense" as const, allocationBucket: "needs" as const, icon: "🏠" },
  { name: "Groceries", type: "expense" as const, allocationBucket: "needs" as const, icon: "🛒" },
  { name: "Utilities", type: "expense" as const, allocationBucket: "needs" as const, icon: "⚡" },
  { name: "Insurance", type: "expense" as const, allocationBucket: "needs" as const, icon: "🛡️" },
  { name: "Transportation", type: "expense" as const, allocationBucket: "needs" as const, icon: "🚗" },
  { name: "Healthcare", type: "expense" as const, allocationBucket: "needs" as const, icon: "🏥" },

  // Wants (30%)
  { name: "Dining Out", type: "expense" as const, allocationBucket: "wants" as const, icon: "🍽️" },
  { name: "Entertainment", type: "expense" as const, allocationBucket: "wants" as const, icon: "🎬" },
  { name: "Shopping", type: "expense" as const, allocationBucket: "wants" as const, icon: "🛍️" },
  { name: "Subscriptions", type: "expense" as const, allocationBucket: "wants" as const, icon: "📺" },
  { name: "Hobbies", type: "expense" as const, allocationBucket: "wants" as const, icon: "🎨" },

  // Future (20%)
  { name: "Savings", type: "expense" as const, allocationBucket: "future" as const, icon: "💰" },
  { name: "Investments", type: "expense" as const, allocationBucket: "future" as const, icon: "📈" },
  { name: "Emergency Fund", type: "expense" as const, allocationBucket: "future" as const, icon: "🏦" },
  { name: "Debt Repayment", type: "expense" as const, allocationBucket: "future" as const, icon: "💳" },

  // Income (no allocation)
  { name: "Salary", type: "income" as const, allocationBucket: null, icon: "💵" },
  { name: "Freelance", type: "income" as const, allocationBucket: null, icon: "💼" },
  { name: "Other Income", type: "income" as const, allocationBucket: null, icon: "💸" },
] as const;
