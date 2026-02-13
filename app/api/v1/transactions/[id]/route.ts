import { db } from '@/lib/db';
import { transactions } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const transactionUpdateSchema = z.object({
  amount: z.string().or(z.number()).transform(v => String(v)).optional(),
  type: z.enum(['expense', 'income']).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const transaction = await db.query.transactions.findFirst({
    where: and(eq(transactions.id, id), eq(transactions.userId, session.user.id)),
    with: { category: true },
  });

  if (!transaction) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: transaction });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const validated = transactionUpdateSchema.parse(body);

    const [updated] = await db.update(transactions)
      .set({
        ...validated,
        categoryId: validated.categoryId === null ? null : validated.categoryId,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)))
      .returning();

    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const [deleted] = await db.delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)))
    .returning();

  if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: deleted });
}
