import { db } from '@/lib/db';
import { transactions, financialProfile } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    return Response.json({ error: 'Month parameter required (YYYY-MM)' }, { status: 400 });
  }

  // Get financial profile
  const profile = await db.query.financialProfile.findFirst({
    where: eq(financialProfile.userId, session.user.id),
  });

  if (!profile) {
    return Response.json({ error: 'Financial profile not found' }, { status: 404 });
  }

  const monthlyIncome = parseFloat(profile.monthlyIncomeTarget);
  const needsTarget = monthlyIncome * (parseFloat(profile.needsPercentage) / 100);
  const wantsTarget = monthlyIncome * (parseFloat(profile.wantsPercentage) / 100);
  const futureTarget = monthlyIncome * (parseFloat(profile.futurePercentage) / 100);

  // Get transactions for the month with their categories
  const [year, monthNum] = month.split('-');
  const startDate = `${year}-${monthNum}-01`;
  const endDate = `${year}-${String(parseInt(monthNum) + 1).padStart(2, '0')}-01`;

  const userTransactions = await db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, session.user.id),
      sql`${transactions.date} >= ${startDate}`,
      sql`${transactions.date} < ${endDate}`,
      eq(transactions.type, 'expense')
    ),
    with: { category: true },
  });

  // Calculate spending by allocation bucket
  let needsActual = 0;
  let wantsActual = 0;
  let futureActual = 0;

  for (const txn of userTransactions) {
    const amount = parseFloat(txn.amount);
    const bucket = txn.category?.allocationBucket;

    if (bucket === 'needs') needsActual += amount;
    else if (bucket === 'wants') wantsActual += amount;
    else if (bucket === 'future') futureActual += amount;
  }

  // Calculate income for the month
  const incomeTransactions = await db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, session.user.id),
      sql`${transactions.date} >= ${startDate}`,
      sql`${transactions.date} < ${endDate}`,
      eq(transactions.type, 'income')
    ),
  });

  const actualIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return Response.json({
    data: {
      income: actualIncome || monthlyIncome,
      targets: {
        needs: needsTarget,
        wants: wantsTarget,
        future: futureTarget,
      },
      actual: {
        needs: needsActual,
        wants: wantsActual,
        future: futureActual,
      },
    },
  });
}
