import { db } from '@/lib/db';
import { financialProfile } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { withAuth, withValidation, errorResponse } from '@/lib/api-utils';
import type { Session } from '@/lib/auth';

// Percentage sum validation
const percentageFields = {
  needsPercentage: z.number().min(0).max(100).default(50),
  wantsPercentage: z.number().min(0).max(100).default(30),
  futurePercentage: z.number().min(0).max(100).default(20),
};

function validatePercentageSum<T extends { needsPercentage: number; wantsPercentage: number; futurePercentage: number }>(
  data: T
): boolean {
  const sum = data.needsPercentage + data.wantsPercentage + data.futurePercentage;
  return Math.abs(sum - 100) < 0.01;
}

const createProfileSchema = z.object({
  monthlyIncomeTarget: z.number().positive().max(1_000_000_000),
  ...percentageFields,
}).refine(validatePercentageSum, { message: "Percentages must sum to exactly 100%" });

const updateProfileSchema = z.object({
  monthlyIncomeTarget: z.number().positive().max(1_000_000_000).optional(),
  needsPercentage: z.number().min(0).max(100).optional(),
  wantsPercentage: z.number().min(0).max(100).optional(),
  futurePercentage: z.number().min(0).max(100).optional(),
}).refine((data) => {
  const hasAny = data.needsPercentage !== undefined || data.wantsPercentage !== undefined || data.futurePercentage !== undefined;
  if (!hasAny) return true;
  if (!data.needsPercentage || !data.wantsPercentage || !data.futurePercentage) return false;
  return validatePercentageSum(data as { needsPercentage: number; wantsPercentage: number; futurePercentage: number });
}, { message: "When updating percentages, all three must be provided and sum to 100%" });

// Helper to build update data with string conversion
function buildUpdateData(data: Partial<z.infer<typeof updateProfileSchema>>): Record<string, string> {
  const result: Record<string, string> = {};
  if (data.monthlyIncomeTarget !== undefined) result.monthlyIncomeTarget = data.monthlyIncomeTarget.toString();
  if (data.needsPercentage !== undefined) result.needsPercentage = data.needsPercentage.toString();
  if (data.wantsPercentage !== undefined) result.wantsPercentage = data.wantsPercentage.toString();
  if (data.futurePercentage !== undefined) result.futurePercentage = data.futurePercentage.toString();
  return result;
}

async function getProfile(session: Session) {
  return db.query.financialProfile.findFirst({
    where: eq(financialProfile.userId, session.user.id),
  });
}

export const GET = withAuth(async (session) => {
  const profile = await getProfile(session);
  if (!profile) return errorResponse('Not found', 404);
  return Response.json({ data: profile });
});

export const POST = withAuth(
  withValidation(createProfileSchema, async (data, session) => {
    const existing = await getProfile(session);
    if (existing) return errorResponse('Profile already exists', 409);

    const [profile] = await db.insert(financialProfile).values({
      userId: session.user.id,
      monthlyIncomeTarget: data.monthlyIncomeTarget.toString(),
      needsPercentage: data.needsPercentage.toString(),
      wantsPercentage: data.wantsPercentage.toString(),
      futurePercentage: data.futurePercentage.toString(),
    }).returning();

    return Response.json({ data: profile }, { status: 201 });
  })
);

export const PATCH = withAuth(
  withValidation(updateProfileSchema, async (data, session) => {
    const existing = await getProfile(session);
    if (!existing) return errorResponse('Not found', 404);

    const updateData = buildUpdateData(data);
    if (Object.keys(updateData).length === 0) return Response.json({ data: existing });

    const [updated] = await db.update(financialProfile)
      .set(updateData)
      .where(eq(financialProfile.userId, session.user.id))
      .returning();

    return Response.json({ data: updated });
  })
);
