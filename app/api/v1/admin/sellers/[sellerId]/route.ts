import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { moderateSeller } from "@/server/sellers/service";
import { parseJsonBody } from "@/server/validation/request";
import { adminSellerUpdateSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ sellerId: string }> }) {
  const context = getRequestContext(request);

  try {
    const actor = await requireRole(request, ["ADMIN"]);
    const body = await parseJsonBody(request, adminSellerUpdateSchema);
    const { sellerId } = await params;
    const seller = await moderateSeller({ actor, sellerId, ...body, context });

    return ok({ seller });
  } catch (error) {
    return fail(error, context.requestId);
  }
}
