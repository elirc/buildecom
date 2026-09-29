import { orderStatuses } from "@/domain/orders/order-state";
import { sellerStatuses } from "@/domain/sellers/seller-policy";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(320).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128)
});

export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99)
});

export const checkoutSessionSchema = z.object({
  cartId: z.string().cuid(),
  shippingAddressId: z.string().cuid(),
  idempotencyKey: z.string().uuid()
});

export const orderStatusSchema = z.object({
  status: z.enum(orderStatuses)
});

export const sellerOnboardingSchema = z.object({
  shopName: z.string().min(3).max(80),
  displayName: z.string().min(3).max(80),
  supportEmail: z.string().email(),
  businessType: z.enum(["INDIVIDUAL", "COMPANY"]),
  taxCountry: z.string().length(2)
});

export const adminSellerUpdateSchema = z.object({
  status: z.enum(sellerStatuses),
  internalNote: z.string().min(8).max(2000)
});

export const adminDisputeUpdateSchema = z.object({
  status: z.enum(["OPEN", "REVIEWING", "CLOSED"]),
  resolution: z.enum(["REFUND_BUYER", "RELEASE_TO_SELLER", "ESCALATE"]).optional(),
  internalNote: z.string().min(8).max(2000)
});

export const productQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  sellerId: z.string().cuid().optional(),
  priceBand: z.enum(["under-50", "50-100", "over-100"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(60).default(24)
});
