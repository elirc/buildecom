export const DEFAULT_PLATFORM_COMMISSION_BASIS_POINTS = 1200;
export const MIN_COMMISSION_BASIS_POINTS = 500;
export const MAX_COMMISSION_BASIS_POINTS = 2500;

export function normalizeCommissionBasisPoints(value?: number | null) {
  const nextValue = value ?? DEFAULT_PLATFORM_COMMISSION_BASIS_POINTS;

  if (nextValue < MIN_COMMISSION_BASIS_POINTS || nextValue > MAX_COMMISSION_BASIS_POINTS) {
    throw new Error("SELLER_COMMISSION_OUT_OF_RANGE");
  }

  return nextValue;
}
