import { toApiError } from "./errors";
import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(error: unknown, requestId?: string) {
  const apiError = toApiError(error);

  return NextResponse.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details,
        requestId
      }
    },
    { status: apiError.status }
  );
}
