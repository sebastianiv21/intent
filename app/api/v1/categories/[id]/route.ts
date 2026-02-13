import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['expense', 'income']).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(7).optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const category = await db.query.categories.findFirst({
    where: and(eq(categories.id, id), eq(categories.userId, session.user.id)),
  });

  if (!category) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: category });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const validated = categoryUpdateSchema.parse(body);

    const [updated] = await db.update(categories)
      .set(validated)
      .where(and(eq(categories.id, id), eq(categories.userId, session.user.id)))
      .returning();

    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const [deleted] = await db.delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, session.user.id)))
    .returning();

  if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ data: deleted });
}
