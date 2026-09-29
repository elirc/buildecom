import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

export type RequestContext = {
  requestId: string;
  ipAddress: string;
  userAgent?: string;
};

export function getRequestContext(request: NextRequest): RequestContext {
  return {
    requestId: request.headers.get("x-request-id") ?? randomUUID(),
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1",
    userAgent: request.headers.get("user-agent") ?? undefined
  };
}
