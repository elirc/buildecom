export type PriceBand = "under-50" | "50-100" | "over-100";

export type CatalogFilters = {
  query?: string;
  category?: string;
  sellerId?: string;
  priceBand?: PriceBand | string;
};

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type CatalogFacets = {
  categories: FacetOption[];
  sellers: FacetOption[];
};

export type ProductCardView = {
  id: string;
  slug: string;
  title: string;
  category: string;
  priceCents: number;
  stock: number;
  primaryImageUrl: string;
  sellerName: string;
  ratingAverage: number;
  reviewCount: number;
};

export type MarketplaceHomeView = {
  products: ProductCardView[];
  facets: CatalogFacets;
  selectedFilters: CatalogFilters;
  totalCount: number;
  approvedSellerCount: number;
};

export type ProductDetailsView = ProductCardView & {
  description: string;
  seller: {
    id: string;
    name: string;
    location: string;
  };
};
