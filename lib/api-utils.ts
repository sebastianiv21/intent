import { auth } from "@/lib/auth";
import { z } from "zod";
import type { Session } from "@/lib/auth";

// Unified error response helper
export function errorResponse(message: string, status: number = 400): Response {
  return Response.json({ error: message }, { status });
}

// Auth wrapper for API routes (@vercel server-auth-actions)
export function withAuth(
  handler: (session: Session, request: Request) => Promise<Response> | Response
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return errorResponse("Unauthorized", 401);
    return handler(session, request);
  };
}

// Validation wrapper for Zod schemas
export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: (data: z.infer<T>, session: Session, request: Request) => Promise<Response> | Response
): (session: Session, request: Request) => Promise<Response> {
  return async (session: Session, request: Request) => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      return handler(validated, session, request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(JSON.stringify(error.issues), 400);
      }
      return errorResponse("Invalid request body", 400);
    }
  };
}

// Combine auth + validation for common case
export function withAuthAndValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: (data: z.infer<T>, session: Session) => Promise<Response> | Response
): (request: Request) => Promise<Response> {
  return withAuth(withValidation(schema, async (data, session) => handler(data, session)));
}

// Parse search params helper
export function getSearchParams(request: Request): URLSearchParams {
  return new URL(request.url).searchParams;
}

// Common query param parsers
export function parseNumberParam(params: URLSearchParams, key: string, defaultValue: number): number {
  const value = params.get(key);
  return value ? parseInt(value, 10) : defaultValue;
}
