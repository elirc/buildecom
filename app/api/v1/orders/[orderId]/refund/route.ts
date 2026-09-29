import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { refundOrder } from "@/server/orders/service";
import { z } from "zod";
import { parseJsonBody } from "@/server/validation/request";
import type { NextRequest } from "next/server";

const refundSchema = z.object({
  amountCents: z.number().int().positive().optional()
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const context = getRequestContext(request);

  try {
    const actor = await requireRole(request, ["ADMIN"]);
    const body = await parseJsonBody(request, refundSchema);
    const { orderId } = await params;
    const order = await refundOrder({ actor, orderId, amountCents: body.amountCents, requestId: context.requestId });

    return ok({ order });
  } catch (error) {
    return fail(error, context.requestId);
  }
}
