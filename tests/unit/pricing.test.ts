import { calculateCheckoutPricing } from "@/domain/checkout/pricing";
import { describe, expect, it } from "vitest";

describe("checkout pricing", () => {
  it("splits a cart across sellers and platform fees", () => {
    const pricing = calculateCheckoutPricing(
      [
        { productId: "p1", sellerId: "s1", unitPriceCents: 4_800, quantity: 1, availableStock: 8 },
        { productId: "p2", sellerId: "s2", unitPriceCents: 3_400, quantity: 2, availableStock: 12 }
      ],
      [
        { sellerId: "s1", commissionBasisPoints: 1200 },
        { sellerId: "s2", commissionBasisPoints: 1000 }
      ]
    );

    expect(pricing.subtotalCents).toBe(11_600);
    expect(pricing.platformFeeCents).toBe(1_256);
    expect(pricing.sellerReceivesCents).toBe(10_344);
    expect(pricing.splits).toHaveLength(2);
  });

  it("rejects oversold inventory before payment", () => {
    expect(() =>
      calculateCheckoutPricing(
        [{ productId: "p1", sellerId: "s1", unitPriceCents: 4_800, quantity: 9, availableStock: 8 }],
        [{ sellerId: "s1", commissionBasisPoints: 1200 }]
      )
    ).toThrow("CHECKOUT_INSUFFICIENT_STOCK");
  });
});
