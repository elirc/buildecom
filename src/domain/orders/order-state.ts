export const orderStatuses = ["PLACED", "PAID", "SHIPPED", "DELIVERED", "REFUNDED"] as const;

export type OrderStatus = (typeof orderStatuses)[number];

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["PAID", "REFUNDED"],
  PAID: ["SHIPPED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
  REFUNDED: []
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus) {
  return allowedTransitions[from].includes(to);
}

export function assertOrderTransition(from: OrderStatus, to: OrderStatus) {
  if (!canTransitionOrder(from, to)) {
    throw new Error(`ORDER_INVALID_TRANSITION:${from}->${to}`);
  }
}

export function nextFulfillmentStatus(status: OrderStatus) {
  if (status === "PLACED") return "PAID";
  if (status === "PAID") return "SHIPPED";
  if (status === "SHIPPED") return "DELIVERED";
  return null;
}
