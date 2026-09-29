import { assertOrderTransition, type OrderStatus } from "@/domain/orders/order-state";
import { ApiError } from "@/server/api/errors";
import { prisma } from "@/server/db/prisma";
import { notifyOrderStatus } from "@/server/notifications/service";
import { issueOrderRefund } from "@/server/payments/stripe-connect";
import type { SessionUser } from "@/server/auth/session";
import "server-only";

export async function updateOrderStatus(input: {
  actor: SessionUser;
  orderId: string;
  status: OrderStatus;
  requestId?: string;
}) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: input.orderId },
    include: { splits: true }
  });

  if (input.actor.role === "SELLER" && input.status !== "SHIPPED" && input.status !== "DELIVERED") {
    throw new ApiError("ORDER_SELLER_STATUS_FORBIDDEN", 403, "Sellers can only update fulfillment states.");
  }

  if (input.actor.role === "SELLER") {
    const ownsOrder = Boolean(input.actor.sellerId && order.splits.some((split) => split.sellerId === input.actor.sellerId));

    if (!ownsOrder) {
      throw new ApiError("ORDER_SELLER_SCOPE_FORBIDDEN", 403, "Seller cannot update this order.");
    }
  }

  assertOrderTransition(order.status, input.status);

  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: input.orderId },
      data: {
        status: input.status,
        events: {
          create: {
            status: input.status,
            message: `Order moved from ${order.status} to ${input.status}.`,
            metadata: { actorId: input.actor.id }
          }
        }
      }
    });

    await tx.auditLog.create({
      data: {
        actorType: "USER",
        actorId: input.actor.id,
        action: "order.status.update",
        entityType: "Order",
        entityId: input.orderId,
        requestId: input.requestId,
        metadata: {
          from: order.status,
          to: input.status
        }
      }
    });

    return updatedOrder;
  });

  await notifyOrderStatus({
    buyerId: updated.buyerId,
    orderNumber: updated.orderNumber,
    status: updated.status
  });

  return updated;
}

export async function refundOrder(input: { actor: SessionUser; orderId: string; amountCents?: number; requestId?: string }) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: input.orderId }
  });

  if (!order.stripePaymentIntentId) {
    throw new Error("ORDER_PAYMENT_INTENT_MISSING");
  }

  assertOrderTransition(order.status, "REFUNDED");

  const refund = await issueOrderRefund(order.stripePaymentIntentId, input.amountCents);

  return prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: input.orderId },
      data: {
        status: "REFUNDED",
        events: {
          create: {
            status: "REFUNDED",
            message: "Refund issued through Stripe.",
            metadata: {
              refundId: refund.id,
              amountCents: input.amountCents ?? order.totalCents
            }
          }
        }
      }
    });

    await tx.auditLog.create({
      data: {
        actorType: "USER",
        actorId: input.actor.id,
        action: "order.refund",
        entityType: "Order",
        entityId: input.orderId,
        requestId: input.requestId,
        metadata: {
          refundId: refund.id,
          amountCents: input.amountCents ?? order.totalCents
        }
      }
    });

    return updatedOrder;
  });
}
