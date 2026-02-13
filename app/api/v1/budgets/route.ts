import { db } from '@/lib/db';
import { budgets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { withAuth, withAuthAndValidation } from '@/lib/api-utils';

const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.union([z.string(), z.number()]).transform(v => String(v)),
  period: z.enum(['monthly', 'weekly']),
  startDate: z.string(),
});

export const GET = withAuth(async (session) => {
  const data = await db.query.budgets.findMany({
    where: eq(budgets.userId, session.user.id),
    with: { category: true },
  });

  return Response.json({ data });
});

export const POST = withAuthAndValidation(budgetSchema, async (data, session) => {
  const [budget] = await db.insert(budgets).values({
    userId: session.user.id,
    ...data,
  }).returning();

  return Response.json({ data: budget }, { status: 201 });
});
