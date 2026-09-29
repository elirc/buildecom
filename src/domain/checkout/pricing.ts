import { addCents } from "./money";

export type CheckoutLineInput = {
  productId: string;
  sellerId: string;
  unitPriceCents: number;
  quantity: number;
  availableStock: number;
};

export type SellerCommissionInput = {
  sellerId: string;
  commissionBasisPoints: number;
};

export type SellerSplit = {
  sellerId: string;
  subtotalCents: number;
  platformFeeCents: number;
  sellerReceivesCents: number;
};

export type CheckoutPricing = {
  subtotalCents: number;
  platformFeeCents: number;
  sellerReceivesCents: number;
  splits: SellerSplit[];
};

export function calculateCheckoutPricing(
  lines: CheckoutLineInput[],
  commissions: SellerCommissionInput[]
): CheckoutPricing {
  if (lines.length === 0) {
    throw new Error("CHECKOUT_EMPTY_CART");
  }

  for (const line of lines) {
    if (line.quantity < 1) {
      throw new Error("CHECKOUT_INVALID_QUANTITY");
    }

    if (line.quantity > line.availableStock) {
      throw new Error("CHECKOUT_INSUFFICIENT_STOCK");
    }
  }

  const commissionBySeller = new Map(commissions.map((commission) => [commission.sellerId, commission]));
  const subtotalBySeller = new Map<string, number>();

  for (const line of lines) {
    subtotalBySeller.set(
      line.sellerId,
      (subtotalBySeller.get(line.sellerId) ?? 0) + line.unitPriceCents * line.quantity
    );
  }

  const splits = Array.from(subtotalBySeller.entries()).map(([sellerId, subtotalCents]) => {
    const commission = commissionBySeller.get(sellerId);

    if (!commission) {
      throw new Error(`CHECKOUT_MISSING_COMMISSION:${sellerId}`);
    }

    const platformFeeCents = Math.round((subtotalCents * commission.commissionBasisPoints) / 10_000);

    return {
      sellerId,
      subtotalCents,
      platformFeeCents,
      sellerReceivesCents: subtotalCents - platformFeeCents
    };
  });

  const subtotalCents = addCents(splits.map((split) => split.subtotalCents));
  const platformFeeCents = addCents(splits.map((split) => split.platformFeeCents));

  return {
    subtotalCents,
    platformFeeCents,
    sellerReceivesCents: subtotalCents - platformFeeCents,
    splits
  };
}
