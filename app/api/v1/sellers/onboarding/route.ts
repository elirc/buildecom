import { created, fail } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { upsertSellerOnboarding } from "@/server/sellers/service";
import { parseJsonBody } from "@/server/validation/request";
import { sellerOnboardingSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const actor = await requireRole(request, ["SELLER"]);
    const body = await parseJsonBody(request, sellerOnboardingSchema);
    const seller = await upsertSellerOnboarding({ actor, ...body, context });

    return created({ seller });
  } catch (error) {
    return fail(error, context.requestId);
  }
}
