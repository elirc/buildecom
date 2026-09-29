import { ApiError } from "@/server/api/errors";
import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { createTokenPair, setAuthCookies } from "@/server/auth/session";
import { verifyPassword } from "@/server/auth/password";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { parseJsonBody } from "@/server/validation/request";
import { loginSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    await enforceRateLimit({ key: `login:${context.ipAddress}`, limit: 10, windowSeconds: 60 });
    const body = await parseJsonBody(request, loginSchema);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { sellerProfile: true }
    });

    if (!user || user.status !== "ACTIVE" || !(await verifyPassword(body.password, user.passwordHash))) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return fail(new ApiError("AUTH_INVALID_CREDENTIALS", 401, "Invalid email or password."), context.requestId);
    }

    const tokenPair = await createTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      sellerId: user.sellerProfile?.id
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokenPair.refreshTokenHash,
        familyId: tokenPair.refreshTokenFamilyId,
        expiresAt: tokenPair.refreshTokenExpiresAt
      }
    });

    const response = ok({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        sellerId: user.sellerProfile?.id
      }
    });

    setAuthCookies(response, tokenPair);
    return response;
  } catch (error) {
    return fail(error, context.requestId);
  }
}
