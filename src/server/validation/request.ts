import { badRequest } from "@/server/api/errors";
import type { NextRequest } from "next/server";
import type { z } from "zod";

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(request: NextRequest, schema: TSchema) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    throw badRequest("Request body must be valid JSON.");
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    throw badRequest("Request validation failed.", result.error.flatten());
  }

  return result.data as z.infer<TSchema>;
}
