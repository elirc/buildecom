import { assertOrderTransition, canTransitionOrder, nextFulfillmentStatus } from "@/domain/orders/order-state";
import { describe, expect, it } from "vitest";

describe("order state machine", () => {
  it("allows the happy-path fulfillment flow", () => {
    expect(canTransitionOrder("PLACED", "PAID")).toBe(true);
    expect(canTransitionOrder("PAID", "SHIPPED")).toBe(true);
    expect(canTransitionOrder("SHIPPED", "DELIVERED")).toBe(true);
  });

  it("blocks backwards fulfillment transitions", () => {
    expect(() => assertOrderTransition("DELIVERED", "SHIPPED")).toThrow("ORDER_INVALID_TRANSITION");
  });

  it("returns the next fulfillment state", () => {
    expect(nextFulfillmentStatus("PLACED")).toBe("PAID");
    expect(nextFulfillmentStatus("PAID")).toBe("SHIPPED");
    expect(nextFulfillmentStatus("DELIVERED")).toBeNull();
  });
});
