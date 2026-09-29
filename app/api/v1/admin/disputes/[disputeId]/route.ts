import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { moderateDispute } from "@/server/sellers/service";
import { parseJsonBody } from "@/server/validation/request";
import { adminDisputeUpdateSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ disputeId: string }> }) {
  const context = getRequestContext(request);

  try {
    const actor = await requireRole(request, ["ADMIN"]);
    const body = await parseJsonBody(request, adminDisputeUpdateSchema);
    const { disputeId } = await params;
    const dispute = await moderateDispute({ actor, disputeId, ...body, context });

    return ok({ dispute });
  } catch (error) {
    return fail(error, context.requestId);
  }
}
