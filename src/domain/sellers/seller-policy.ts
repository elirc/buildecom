export const sellerStatuses = ["PENDING", "APPROVED", "SUSPENDED", "REJECTED"] as const;

export type SellerStatus = (typeof sellerStatuses)[number];

export function canSellerListProducts(status: SellerStatus) {
  return status === "APPROVED";
}

export function canApproveSeller(status: SellerStatus) {
  return status === "PENDING" || status === "SUSPENDED";
}

export function canSuspendSeller(status: SellerStatus) {
  return status === "APPROVED" || status === "PENDING";
}
