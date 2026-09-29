import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  active: "marketplace" | "seller" | "admin";
  children: ReactNode;
};

const navItems = [
  { key: "marketplace", href: "/", label: "Marketplace" },
  { key: "seller", href: "/seller/dashboard", label: "Seller center" },
  { key: "admin", href: "/admin/disputes", label: "Admin console" }
] as const;

export function AppShell({ active, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">MF</span>
          <span>
            <span className="brand-title">MarketForge</span>
            <span className="brand-caption">Marketplace platform</span>
          </span>
        </Link>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              className="nav-link"
              href={item.href}
              aria-current={item.key === active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-panel">
          <strong>Production patterns</strong>
          <p>RBAC, refresh token rotation, rate limits, audit logs, idempotency, and payout ledgers.</p>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <strong>MarketForge</strong>
            <div className="muted small">Multi-tenant commerce operations</div>
          </div>
          <span className="chip success">API v1</span>
        </header>
        {children}
      </div>
    </div>
  );
}
