import type { SellerSplit } from "@/domain/checkout/pricing";
import { env } from "@/server/env";
import Stripe from "stripe";
import "server-only";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "MarketForge",
    version: "0.1.0"
  }
});

export type MarketplacePaymentInput = {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  amountCents: number;
  currency: string;
  splits: SellerSplit[];
};

export async function createMarketplacePaymentIntent(input: MarketplacePaymentInput) {
  const transferGroup = `marketforge_order_${input.orderId}`;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: input.amountCents,
    currency: input.currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    transfer_group: transferGroup,
    metadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      buyerId: input.buyerId,
      sellerCount: String(input.splits.length)
    }
  });

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    transferGroup
  };
}

export async function createSellerTransfers(input: {
  orderId: string;
  transferGroup: string;
  currency: string;
  splits: Array<SellerSplit & { stripeAccountId: string }>;
}) {
  return Promise.all(
    input.splits.map((split) =>
      stripe.transfers.create({
        amount: split.sellerReceivesCents,
        currency: input.currency.toLowerCase(),
        destination: split.stripeAccountId,
        transfer_group: input.transferGroup,
        metadata: {
          orderId: input.orderId,
          sellerId: split.sellerId
        }
      })
    )
  );
}

export async function issueOrderRefund(paymentIntentId: string, amountCents?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountCents ? { amount: amountCents } : {})
  });
}

export function constructStripeWebhookEvent(rawBody: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}
