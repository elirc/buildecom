import { unauthorized } from "@/server/api/errors";
import { env } from "@/server/env";
import type { Role } from "./rbac";
import { createHash, randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";
import "server-only";

export const ACCESS_TOKEN_COOKIE = "mf_access";
export const REFRESH_TOKEN_COOKIE = "mf_refresh";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  sellerId?: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  refreshTokenExpiresAt: Date;
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function createTokenPair(user: SessionUser, existingFamilyId?: string): Promise<TokenPair> {
  const refreshTokenFamilyId = existingFamilyId ?? randomUUID();
  const refreshJti = randomUUID();
  const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const accessToken = await new SignJWT({ role: user.role, email: user.email, sellerId: user.sellerId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);

  const refreshToken = await new SignJWT({ familyId: refreshTokenFamilyId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(refreshJti)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(refreshSecret);

  return {
    accessToken,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenFamilyId,
    refreshTokenExpiresAt
  };
}

export async function verifyAccessToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, accessSecret);

  if (!payload.sub || typeof payload.email !== "string" || !isRole(payload.role)) {
    throw unauthorized("Invalid access token.");
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    sellerId: typeof payload.sellerId === "string" ? payload.sellerId : undefined
  };
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshSecret);

  if (!payload.sub || typeof payload.familyId !== "string" || typeof payload.jti !== "string") {
    throw unauthorized("Invalid refresh token.");
  }

  return {
    userId: payload.sub,
    familyId: payload.familyId,
    jti: payload.jti,
    tokenHash: hashToken(token)
  };
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    throw unauthorized();
  }

  return verifyAccessToken(token);
}

export function setAuthCookies(response: NextResponse, pair: TokenPair) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, pair.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, pair.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function isRole(value: unknown): value is Role {
  return value === "BUYER" || value === "SELLER" || value === "ADMIN";
}
