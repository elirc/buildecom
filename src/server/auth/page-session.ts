import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "./session";
import { cookies } from "next/headers";
import "server-only";

export async function getPageSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAccessToken(token);
}
