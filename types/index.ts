export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  type: 'expense' | 'income';
  description: string | null;
  date: string;
  createdAt: string;
  category?: Category;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'expense' | 'income';
  allocationBucket: 'needs' | 'wants' | 'future' | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  period: 'monthly' | 'weekly';
  startDate: string;
  createdAt: string;
  category?: Category;
}

export interface FinancialProfile {
  userId: string;
  monthlyIncomeTarget: string;
  needsPercentage: string;
  wantsPercentage: string;
  futurePercentage: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  type: 'expense' | 'income';
  description: string | null;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  lastGeneratedDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface InsightsData {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  spendingByCategory: { name: string; value: number }[];
  transactionCount: number;
}

export interface AllocationSummary {
  income: number;
  targets: {
    needs: number;
    wants: number;
    future: number;
  };
  actual: {
    needs: number;
    wants: number;
    future: number;
  };
}
