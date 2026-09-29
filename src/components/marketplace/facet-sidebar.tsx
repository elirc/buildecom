import type { CatalogFacets, CatalogFilters } from "@/types/marketplace";

export function FacetSidebar({ facets, selected }: { facets: CatalogFacets; selected: CatalogFilters }) {
  return (
    <aside className="surface panel">
      <form className="stack" action="/">
        <div className="stack">
          <label htmlFor="q">
            <strong>Search</strong>
          </label>
          <input id="q" name="q" defaultValue={selected.query} placeholder="Product, tag, seller" />
        </div>

        <div className="stack">
          <label htmlFor="category">
            <strong>Category</strong>
          </label>
          <select id="category" name="category" defaultValue={selected.category ?? ""}>
            <option value="">All categories</option>
            {facets.categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <div className="stack">
          <label htmlFor="sellerId">
            <strong>Seller</strong>
          </label>
          <select id="sellerId" name="sellerId" defaultValue={selected.sellerId ?? ""}>
            <option value="">All sellers</option>
            {facets.sellers.map((seller) => (
              <option key={seller.value} value={seller.value}>
                {seller.label} ({seller.count})
              </option>
            ))}
          </select>
        </div>

        <div className="stack">
          <label htmlFor="priceBand">
            <strong>Price</strong>
          </label>
          <select id="priceBand" name="priceBand" defaultValue={selected.priceBand ?? ""}>
            <option value="">Any price</option>
            <option value="under-50">Under $50</option>
            <option value="50-100">$50 to $100</option>
            <option value="over-100">$100+</option>
          </select>
        </div>

        <button className="button" type="submit">
          Apply filters
        </button>
      </form>
    </aside>
  );
}
