import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { REFRESH_TOKEN_COOKIE, clearAuthCookies, hashToken } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(refreshToken) },
        data: { revokedAt: new Date() }
      });
    }

    const response = ok({ loggedOut: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return fail(error, context.requestId);
  }
}
