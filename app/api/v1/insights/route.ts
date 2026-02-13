import { db } from '@/lib/db';
import { transactions } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { withAuth, getSearchParams } from '@/lib/api-utils';

// Calculate start date based on period
function getStartDate(period: string): string {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  return startDate.toISOString().split('T')[0];
}

// Aggregate transactions by category and type (@vercel js-combine-iterations)
function aggregateByCategory(
  items: typeof transactions.$inferSelect[],
  type: 'expense' | 'income'
): Record<string, number> {
  return items.reduce((acc, t) => {
    if (t.type !== type) return acc;
    const categoryName = t.category?.name || 'Uncategorized';
    acc[categoryName] = (acc[categoryName] || 0) + parseFloat(t.amount);
    return acc;
  }, {} as Record<string, number>);
}

export const GET = withAuth(async (session, request) => {
  const params = getSearchParams(request);
  const period = params.get('period') || 'month';
  const startDate = getStartDate(period);

  const userTransactions = await db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, session.user.id),
      sql`${transactions.date} >= ${startDate}`
    ),
    with: { category: true },
  });

  const spendingByCategory = aggregateByCategory(userTransactions, 'expense');
  const incomeByCategory = aggregateByCategory(userTransactions, 'income');

  const totalExpenses = Object.values(spendingByCategory).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(spendingByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return Response.json({
    data: {
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
      spendingByCategory: categoryData,
      transactionCount: userTransactions.length,
    },
  });
});
