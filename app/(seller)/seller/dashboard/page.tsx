import { StatCard } from "@/components/dashboard/stat-card";
import { AppShell } from "@/components/shell/app-shell";
import { formatMoney } from "@/domain/checkout/money";
import { getSellerDashboard } from "@/server/sellers/queries";

export default async function SellerDashboardPage() {
  const dashboard = await getSellerDashboard();

  return (
    <AppShell active="seller">
      <main className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Seller operations</p>
            <h1>{dashboard.seller.shopName}</h1>
            <p>Manage inventory, fulfillment, payout readiness, and catalog health.</p>
          </div>
          <span className={`chip ${dashboard.seller.status === "APPROVED" ? "success" : "warning"}`}>
            {dashboard.seller.status}
          </span>
        </div>

        <div className="metric-grid">
          <StatCard label="Revenue" value={formatMoney(dashboard.metrics.revenueCents)} />
          <StatCard label="Orders" value={dashboard.metrics.orderCount.toString()} />
          <StatCard label="Conversion" value={`${dashboard.metrics.conversionRate}%`} />
          <StatCard label="Refund rate" value={`${dashboard.metrics.refundRate}%`} />
        </div>

        <section className="surface panel stack" style={{ marginTop: 20 }}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Listings</h2>
            </div>
            <a className="button" href="/seller/products/new">
              New listing
            </a>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.title}</strong>
                    <div className="muted small">{product.category}</div>
                  </td>
                  <td>
                    <span className={`chip ${product.isActive ? "success" : "warning"}`}>
                      {product.isActive ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td>{product.stock}</td>
                  <td>{formatMoney(product.priceCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
