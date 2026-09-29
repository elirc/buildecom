export const roles = ["BUYER", "SELLER", "ADMIN"] as const;

export type Role = (typeof roles)[number];

const permissions = {
  BUYER: ["cart:write", "checkout:create", "orders:read:self"],
  SELLER: ["products:write:self", "orders:update:fulfillment", "payouts:read:self"],
  ADMIN: ["sellers:moderate", "disputes:moderate", "orders:refund", "analytics:read"]
} satisfies Record<Role, string[]>;

export function hasRole(userRole: Role, acceptedRoles: Role[]) {
  return acceptedRoles.includes(userRole);
}

export function hasPermission(userRole: Role, permission: string) {
  return permissions[userRole].includes(permission);
}

export function assertRole(userRole: Role, acceptedRoles: Role[]) {
  if (!hasRole(userRole, acceptedRoles)) {
    throw new Error("AUTH_FORBIDDEN");
  }
}
