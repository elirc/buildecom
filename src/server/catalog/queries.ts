import { priceBandToCents } from "@/domain/catalog/price-band";
import { prisma } from "@/server/db/prisma";
import type { CatalogFilters, MarketplaceHomeView, ProductDetailsView } from "@/types/marketplace";
import type { Prisma } from "@prisma/client";
import "server-only";

const DEFAULT_PAGE_SIZE = 24;

export async function getMarketplaceHome(filters: CatalogFilters = {}): Promise<MarketplaceHomeView> {
  const where = buildProductWhere(filters);

  const [products, totalCount, approvedSellerCount, categories, sellers] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        seller: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } }
      },
      orderBy: [{ createdAt: "desc" }],
      take: DEFAULT_PAGE_SIZE
    }),
    prisma.product.count({ where }),
    prisma.sellerProfile.count({ where: { status: "APPROVED" } }),
    prisma.product.groupBy({
      by: ["category"],
      where: { isActive: true, seller: { status: "APPROVED" } },
      _count: { _all: true }
    }),
    prisma.sellerProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        shopName: true,
        _count: { select: { products: true } }
      },
      orderBy: { shopName: "asc" }
    })
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      category: product.category,
      priceCents: product.priceCents,
      stock: product.stock,
      primaryImageUrl: product.images[0]?.url ?? "/placeholder-product.png",
      sellerName: product.seller.shopName,
      ratingAverage: average(product.reviews.map((review) => review.rating)),
      reviewCount: product.reviews.length
    })),
    facets: {
      categories: categories.map((category) => ({
        value: category.category,
        label: category.category,
        count: category._count._all
      })),
      sellers: sellers.map((seller) => ({
        value: seller.id,
        label: seller.shopName,
        count: seller._count.products
      }))
    },
    selectedFilters: filters,
    totalCount,
    approvedSellerCount
  };
}

export async function getProductDetails(slug: string): Promise<ProductDetailsView | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      seller: { status: "APPROVED" }
    },
    include: {
      seller: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });

  if (!product) return null;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    description: product.description,
    priceCents: product.priceCents,
    stock: product.stock,
    primaryImageUrl: product.images[0]?.url ?? "/placeholder-product.png",
    sellerName: product.seller.shopName,
    seller: {
      id: product.seller.id,
      name: product.seller.shopName,
      location: product.seller.location
    },
    ratingAverage: average(product.reviews.map((review) => review.rating)),
    reviewCount: product.reviews.length
  };
}

function buildProductWhere(filters: CatalogFilters): Prisma.ProductWhereInput {
  const price = priceBandToCents(filters.priceBand);

  return {
    isActive: true,
    seller: {
      status: "APPROVED",
      ...(filters.sellerId ? { id: filters.sellerId } : {})
    },
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.query
      ? {
          OR: [
            { title: { contains: filters.query, mode: "insensitive" } },
            { description: { contains: filters.query, mode: "insensitive" } },
            { seller: { shopName: { contains: filters.query, mode: "insensitive" } } }
          ]
        }
      : {}),
    ...(price.min || price.max
      ? {
          priceCents: {
            ...(price.min ? { gte: price.min } : {}),
            ...(price.max ? { lte: price.max } : {})
          }
        }
      : {})
  };
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
