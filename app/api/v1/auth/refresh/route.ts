import { ApiError } from "@/server/api/errors";
import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { REFRESH_TOKEN_COOKIE, createTokenPair, setAuthCookies, verifyRefreshToken } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      throw new ApiError("AUTH_REFRESH_TOKEN_MISSING", 401, "Refresh token is missing.");
    }

    const verified = await verifyRefreshToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: verified.tokenHash },
      include: {
        user: {
          include: { sellerProfile: true }
        }
      }
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.updateMany({
        where: { familyId: verified.familyId },
        data: { revokedAt: new Date() }
      });
      throw new ApiError("AUTH_REFRESH_REUSE_DETECTED", 401, "Refresh token is no longer valid.");
    }

    const tokenPair = await createTokenPair(
      {
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
        sellerId: storedToken.user.sellerProfile?.id
      },
      verified.familyId
    );

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() }
      }),
      prisma.refreshToken.create({
        data: {
          userId: storedToken.user.id,
          tokenHash: tokenPair.refreshTokenHash,
          familyId: tokenPair.refreshTokenFamilyId,
          expiresAt: tokenPair.refreshTokenExpiresAt
        }
      })
    ]);

    const response = ok({ refreshed: true });
    setAuthCookies(response, tokenPair);
    return response;
  } catch (error) {
    return fail(error, context.requestId);
  }
}
