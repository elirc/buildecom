import { env } from "@/server/env";
import pino from "pino";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: undefined,
  redact: {
    paths: ["req.headers.authorization", "password", "token", "refreshToken"],
    censor: "[redacted]"
  }
});

export function childLogger(requestId: string) {
  return logger.child({ requestId });
}
