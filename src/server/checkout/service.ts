import { calculateCheckoutPricing } from "@/domain/checkout/pricing";
import type { SessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { notifyLowStock } from "@/server/notifications/service";
import { createMarketplacePaymentIntent } from "@/server/payments/stripe-connect";
import { completeIdempotencyKey, reserveIdempotencyKey } from "@/server/security/idempotency";
import "server-only";

type CreateCheckoutSessionInput = {
  buyer: SessionUser;
  cartId: string;
  shippingAddressId: string;
  idempotencyKey: string;
};

export async function createCheckoutSession(input: CreateCheckoutSessionInput) {
  const reservationKey = await reserveIdempotencyKey(input.idempotencyKey, `checkout:${input.buyer.id}`);

  const cart = await prisma.cart.findFirstOrThrow({
    where: {
      id: input.cartId,
      buyerId: input.buyer.id
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              seller: true
            }
          }
        }
      }
    }
  });

  const address = await prisma.address.findFirstOrThrow({
    where: {
      id: input.shippingAddressId,
      userId: input.buyer.id
    }
  });

  const activeItems = cart.items.filter((item) => item.product.isActive && item.product.seller.status === "APPROVED");

  if (activeItems.length !== cart.items.length) {
    throw new Error("CHECKOUT_CONTAINS_UNAVAILABLE_ITEMS");
  }

  const pricing = calculateCheckoutPricing(
    activeItems.map((item) => ({
      productId: item.productId,
      sellerId: item.product.sellerId,
      unitPriceCents: item.product.priceCents,
      quantity: item.quantity,
      availableStock: item.product.stock
    })),
    activeItems.map((item) => ({
      sellerId: item.product.sellerId,
      commissionBasisPoints: item.product.seller.commissionBasisPoints
    }))
  );

  const order = await prisma.$transaction(async (tx) => {
    for (const item of activeItems) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity }
        },
        data: {
          stock: { decrement: item.quantity }
        }
      });

      if (stockUpdate.count !== 1) {
        throw new Error(`CHECKOUT_STOCK_CHANGED:${item.productId}`);
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: createOrderNumber(),
        buyerId: input.buyer.id,
        status: "PLACED",
        totalCents: pricing.subtotalCents,
        currency: "USD",
        shippingAddressSnapshot: {
          fullName: address.fullName,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          region: address.region,
          postalCode: address.postalCode,
          countryCode: address.countryCode
        },
        items: {
          create: activeItems.map((item) => ({
            productId: item.productId,
            sellerId: item.product.sellerId,
            title: item.product.title,
            quantity: item.quantity,
            priceCents: item.product.priceCents
          }))
        },
        splits: {
          create: pricing.splits.map((split) => ({
            sellerId: split.sellerId,
            subtotalCents: split.subtotalCents,
            platformFeeCents: split.platformFeeCents,
            sellerReceivesCents: split.sellerReceivesCents
          }))
        },
        events: {
          create: {
            status: "PLACED",
            message: "Order placed and awaiting payment authorization."
          }
        }
      },
      include: {
        splits: {
          include: {
            seller: true
          }
        }
      }
    });

    await tx.cartItem.deleteMany({ where: { cartId: input.cartId } });

    return createdOrder;
  });

  const payment = await createMarketplacePaymentIntent({
    orderId: order.id,
    orderNumber: order.orderNumber,
    buyerId: input.buyer.id,
    amountCents: order.totalCents,
    currency: order.currency,
    splits: order.splits
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripePaymentIntentId: payment.paymentIntentId,
      stripeTransferGroup: payment.transferGroup
    }
  });

  await Promise.all(
    activeItems
      .filter((item) => item.product.stock - item.quantity <= 5)
      .map((item) =>
        notifyLowStock({
          sellerOwnerId: item.product.seller.ownerId,
          productTitle: item.product.title,
          remainingStock: item.product.stock - item.quantity
        })
      )
  );

  const responsePayload = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    clientSecret: payment.clientSecret,
    pricing
  };

  await completeIdempotencyKey(reservationKey, responsePayload);

  return responsePayload;
}

function createOrderNumber() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MF-${ymd}-${entropy}`;
}
