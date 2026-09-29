import { FacetSidebar } from "@/components/marketplace/facet-sidebar";
import { ProductCard } from "@/components/marketplace/product-card";
import { AppShell } from "@/components/shell/app-shell";
import { getMarketplaceHome } from "@/server/catalog/queries";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MarketplacePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = await getMarketplaceHome({
    query: readParam(params.q),
    category: readParam(params.category),
    sellerId: readParam(params.sellerId),
    priceBand: readParam(params.priceBand)
  });

  return (
    <AppShell active="marketplace">
      <main className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Buyer storefront</p>
            <h1>Marketplace</h1>
            <p>Search approved sellers, compare listings, and build a multi-seller cart.</p>
          </div>
          <a className="button secondary" href="/seller/dashboard">
            Seller center
          </a>
        </div>

        <section className="market-grid">
          <FacetSidebar facets={page.facets} selected={page.selectedFilters} />
          <div className="stack">
            <div className="row">
              <p className="muted small">{page.totalCount} active listings</p>
              <span className="chip success">{page.approvedSellerCount} approved sellers</span>
            </div>
            <div className="product-grid">
              {page.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
