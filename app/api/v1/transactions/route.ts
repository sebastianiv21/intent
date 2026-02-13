import { db } from "@/lib/db";
import { transactions } from "@/lib/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { z } from "zod";
import { withAuth, withAuthAndValidation, getSearchParams, parseNumberParam } from "@/lib/api-utils";

const transactionSchema = z.object({
  amount: z.union([z.string(), z.number()]).transform((v) => String(v)),
  type: z.enum(["expense", "income"]),
  description: z.string().optional(),
  date: z.string(),
  categoryId: z.string().uuid().optional(),
});

// Build orderBy clause based on query param
function getOrderByClause(orderBy: string) {
  switch (orderBy) {
    case "date_asc": return asc(transactions.createdAt);
    case "amount_desc": return desc(transactions.amount);
    case "amount_asc": return asc(transactions.amount);
    default: return desc(transactions.createdAt);
  }
}

export const GET = withAuth(async (session, request) => {
  const params = getSearchParams(request);
  const type = params.get("type");
  const categoryId = params.get("categoryId");
  const limit = parseNumberParam(params, "limit", 50);
  const offset = parseNumberParam(params, "offset", 0);
  const orderBy = params.get("orderBy") || "date_desc";

  const whereConditions = [eq(transactions.userId, session.user.id)];
  if (type) whereConditions.push(eq(transactions.type, type as "expense" | "income"));
  if (categoryId) whereConditions.push(eq(transactions.categoryId, categoryId));

  const data = await db.query.transactions.findMany({
    where: and(...whereConditions),
    orderBy: getOrderByClause(orderBy),
    limit,
    offset,
    with: { category: true },
  });

  return Response.json({ data });
});

export const POST = withAuthAndValidation(transactionSchema, async (data, session) => {
  const [transaction] = await db
    .insert(transactions)
    .values({ userId: session.user.id, ...data })
    .returning();

  return Response.json({ data: transaction }, { status: 201 });
});
