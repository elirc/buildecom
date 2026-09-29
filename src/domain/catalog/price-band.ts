import type { PriceBand } from "@/types/marketplace";

export function priceBandToCents(priceBand?: string): { min?: number; max?: number } {
  if (priceBand === "under-50") return { max: 4_999 };
  if (priceBand === "50-100") return { min: 5_000, max: 10_000 };
  if (priceBand === "over-100") return { min: 10_001 };
  return {};
}

export function isPriceBand(value?: string): value is PriceBand {
  return value === "under-50" || value === "50-100" || value === "over-100";
}
