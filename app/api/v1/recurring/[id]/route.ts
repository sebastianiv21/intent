import { db } from '@/lib/db';
import { recurringTransactions } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateSchema = z.object({
  amount: z.string().or(z.number()).transform(v => String(v)).optional(),
  type: z.enum(['expense', 'income']).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  nextDueDate: z.string().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().optional().nullable(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const recurring = await db.query.recurringTransactions.findFirst({
    where: and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, session.user.id)),
    with: { category: true },
  });

  if (!recurring) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: recurring });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const validated = updateSchema.parse(body);

    const [updated] = await db.update(recurringTransactions)
      .set({
        ...validated,
        endDate: validated.endDate === null ? null : validated.endDate,
        categoryId: validated.categoryId === null ? null : validated.categoryId,
      })
      .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, session.user.id)))
      .returning();

    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Failed to update recurring transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const [deleted] = await db.delete(recurringTransactions)
    .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, session.user.id)))
    .returning();

  if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: deleted });
}
