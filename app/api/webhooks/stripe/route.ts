import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { prisma } from "@/server/db/prisma";
import { constructStripeWebhookEvent, createSellerTransfers } from "@/server/payments/stripe-connect";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("STRIPE_SIGNATURE_MISSING");
    }

    const rawBody = await request.text();
    const event = constructStripeWebhookEvent(rawBody, signature);

    const existing = await prisma.webhookEvent.findUnique({
      where: { id: event.id }
    });

    if (existing?.processedAt) {
      return ok({ received: true, duplicate: true });
    }

    await prisma.webhookEvent.upsert({
      where: { id: event.id },
      create: {
        id: event.id,
        provider: "stripe",
        eventType: event.type,
        payload: JSON.parse(JSON.stringify(event))
      },
      update: {
        payload: JSON.parse(JSON.stringify(event))
      }
    });

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      await markOrderPaidAndTransferFunds(paymentIntent.id);
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      await markOrderRefundedFromStripe(charge.payment_intent?.toString());
    }

    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: { processedAt: new Date() }
    });

    return ok({ received: true });
  } catch (error) {
    return fail(error, context.requestId);
  }
}

async function markOrderPaidAndTransferFunds(paymentIntentId: string) {
  const order = await prisma.order.findFirstOrThrow({
    where: { stripePaymentIntentId: paymentIntentId },
    include: {
      splits: {
        include: { seller: true }
      }
    }
  });

  if (order.status !== "PLACED") {
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      events: {
        create: {
          status: "PAID",
          message: "Payment confirmed by Stripe webhook."
        }
      }
    }
  });

  if (!order.stripeTransferGroup) return;

  const transferInputs = order.splits
    .filter((split) => Boolean(split.seller.stripeAccountId))
    .map((split) => ({
      splitId: split.id,
      sellerId: split.sellerId,
      subtotalCents: split.subtotalCents,
      platformFeeCents: split.platformFeeCents,
      sellerReceivesCents: split.sellerReceivesCents,
      stripeAccountId: split.seller.stripeAccountId as string
    }));

  const transfers = await createSellerTransfers({
    orderId: order.id,
    transferGroup: order.stripeTransferGroup,
    currency: order.currency,
    splits: transferInputs
  });

  await Promise.all(
    transfers.map((transfer, index) =>
      prisma.orderSplit.update({
        where: { id: transferInputs[index].splitId },
        data: { stripeTransferId: transfer.id }
      })
    )
  );
}

async function markOrderRefundedFromStripe(paymentIntentId?: string) {
  if (!paymentIntentId) return;

  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntentId }
  });

  if (!order || order.status === "REFUNDED") return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "REFUNDED",
      events: {
        create: {
          status: "REFUNDED",
          message: "Refund confirmed by Stripe webhook."
        }
      }
    }
  });
}
