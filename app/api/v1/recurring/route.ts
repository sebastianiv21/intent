import { db } from '@/lib/db';
import { recurringTransactions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { withAuth, withAuthAndValidation } from '@/lib/api-utils';

const recurringSchema = z.object({
  amount: z.union([z.string(), z.number()]).transform(v => String(v)),
  type: z.enum(['expense', 'income']),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string(),
  endDate: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export const GET = withAuth(async (session) => {
  const data = await db.query.recurringTransactions.findMany({
    where: eq(recurringTransactions.userId, session.user.id),
    orderBy: recurringTransactions.createdAt,
    with: { category: true },
  });

  return Response.json({ data });
});

export const POST = withAuthAndValidation(recurringSchema, async (data, session) => {
  const [recurring] = await db.insert(recurringTransactions).values({
    userId: session.user.id,
    nextDueDate: data.startDate,
    endDate: data.endDate || null,
    categoryId: data.categoryId || null,
    ...data,
  }).returning();

  return Response.json({ data: recurring }, { status: 201 });
});
