import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    return new ApiError("BAD_REQUEST", 400, "Request validation failed.", error.flatten());
  }

  if (error instanceof Error) {
    if (/^(CHECKOUT|ORDER|SELLER|CART)_/.test(error.message)) {
      return new ApiError(error.message.split(":")[0], 409, error.message);
    }

    return new ApiError("INTERNAL_SERVER_ERROR", 500, error.message);
  }

  return new ApiError("INTERNAL_SERVER_ERROR", 500, "Unexpected server error.");
}

export function forbidden(message = "You do not have permission to perform this action.") {
  return new ApiError("AUTH_FORBIDDEN", 403, message);
}

export function unauthorized(message = "Authentication is required.") {
  return new ApiError("AUTH_UNAUTHORIZED", 401, message);
}

export function badRequest(message: string, details?: unknown) {
  return new ApiError("BAD_REQUEST", 400, message, details);
}
