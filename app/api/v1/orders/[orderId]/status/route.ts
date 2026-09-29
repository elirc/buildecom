import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { updateOrderStatus } from "@/server/orders/service";
import { parseJsonBody } from "@/server/validation/request";
import { orderStatusSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const context = getRequestContext(request);

  try {
    const actor = await requireRole(request, ["SELLER", "ADMIN"]);
    const body = await parseJsonBody(request, orderStatusSchema);
    const { orderId } = await params;
    const order = await updateOrderStatus({ actor, orderId, status: body.status, requestId: context.requestId });

    return ok({ order });
  } catch (error) {
    return fail(error, context.requestId);
  }
}
