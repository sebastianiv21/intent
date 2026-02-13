import { db } from '@/lib/db';
import { budgets } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const budgetUpdateSchema = z.object({
  categoryId: z.string().uuid().optional(),
  amount: z.string().or(z.number()).transform(v => String(v)).optional(),
  period: z.enum(['monthly', 'weekly']).optional(),
  startDate: z.string().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const budget = await db.query.budgets.findFirst({
    where: and(eq(budgets.id, id), eq(budgets.userId, session.user.id)),
    with: { category: true },
  });

  if (!budget) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: budget });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const validated = budgetUpdateSchema.parse(body);

    const [updated] = await db.update(budgets)
      .set(validated)
      .where(and(eq(budgets.id, id), eq(budgets.userId, session.user.id)))
      .returning();

    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const [deleted] = await db.delete(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, session.user.id)))
    .returning();

  if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: deleted });
}
