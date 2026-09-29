import { StatCard } from "@/components/dashboard/stat-card";
import { AppShell } from "@/components/shell/app-shell";
import { formatMoney } from "@/domain/checkout/money";
import { getAdminDashboard } from "@/server/sellers/queries";

export default async function AdminDisputesPage() {
  const dashboard = await getAdminDashboard();

  return (
    <AppShell active="admin">
      <main className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Platform operations</p>
            <h1>Admin console</h1>
            <p>Approve sellers, handle disputes, and monitor marketplace risk.</p>
          </div>
        </div>

        <div className="metric-grid">
          <StatCard label="GMV" value={formatMoney(dashboard.gmvCents)} />
          <StatCard label="Platform fees" value={formatMoney(dashboard.platformFeeCents)} />
          <StatCard label="Pending sellers" value={dashboard.pendingSellerCount.toString()} />
          <StatCard label="Open disputes" value={dashboard.openDisputeCount.toString()} />
        </div>

        <section className="surface panel stack" style={{ marginTop: 20 }}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">Trust and safety</p>
              <h2>Disputes</h2>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Dispute</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.disputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td>
                    <strong>{dispute.reason}</strong>
                    <div className="muted small">{dispute.orderNumber}</div>
                  </td>
                  <td>{dispute.sellerName}</td>
                  <td>{formatMoney(dispute.amountCents)}</td>
                  <td>
                    <span className="chip warning">{dispute.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
