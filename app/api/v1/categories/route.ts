import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { withAuth, withAuthAndValidation, getSearchParams } from '@/lib/api-utils';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['expense', 'income']),
  icon: z.string().max(50).optional(),
  color: z.string().max(7).optional(),
});

export const GET = withAuth(async (session, request) => {
  const params = getSearchParams(request);
  const type = params.get('type');

  const whereConditions = [eq(categories.userId, session.user.id)];
  if (type) whereConditions.push(eq(categories.type, type as 'expense' | 'income'));

  const data = await db.query.categories.findMany({
    where: and(...whereConditions),
    orderBy: categories.name,
  });

  return Response.json({ data });
});

export const POST = withAuthAndValidation(categorySchema, async (data, session) => {
  const [category] = await db.insert(categories).values({
    userId: session.user.id,
    ...data,
  }).returning();

  return Response.json({ data: category }, { status: 201 });
});
