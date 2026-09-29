import { created, fail } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { createCheckoutSession } from "@/server/checkout/service";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { parseJsonBody } from "@/server/validation/request";
import { checkoutSessionSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const buyer = await requireRole(request, ["BUYER"]);
    await enforceRateLimit({ key: `checkout:${buyer.id}`, limit: 20, windowSeconds: 60 });
    const body = await parseJsonBody(request, checkoutSessionSchema);
    const session = await createCheckoutSession({ buyer, ...body });

    return created(session);
  } catch (error) {
    return fail(error, context.requestId);
  }
}
