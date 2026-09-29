export const DEFAULT_CURRENCY = "USD";

export function formatMoney(amountCents: number, currency = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amountCents / 100);
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function addCents(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}
