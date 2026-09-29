import { forbidden } from "@/server/api/errors";
import { getSessionFromRequest } from "./session";
import { hasRole, type Role } from "./rbac";
import type { NextRequest } from "next/server";
import "server-only";

export async function requireSession(request: NextRequest) {
  return getSessionFromRequest(request);
}

export async function requireRole(request: NextRequest, roles: Role[]) {
  const session = await requireSession(request);

  if (!hasRole(session.role, roles)) {
    throw forbidden();
  }

  return session;
}
