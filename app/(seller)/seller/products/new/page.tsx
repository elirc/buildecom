import { AppShell } from "@/components/shell/app-shell";

export default function NewProductPage() {
  return (
    <AppShell active="seller">
      <main className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Catalog operations</p>
            <h1>New listing</h1>
            <p>Server actions for product creation would live behind this form in the next implementation slice.</p>
          </div>
        </div>

        <section className="surface panel">
          <form className="stack">
            <label className="stack">
              <strong>Title</strong>
              <input name="title" placeholder="Product title" />
            </label>
            <label className="stack">
              <strong>Description</strong>
              <textarea name="description" placeholder="Product description" rows={5} />
            </label>
            <div className="row">
              <label className="stack" style={{ flex: 1 }}>
                <strong>Price</strong>
                <input name="priceCents" type="number" placeholder="4800" />
              </label>
              <label className="stack" style={{ flex: 1 }}>
                <strong>Stock</strong>
                <input name="stock" type="number" placeholder="24" />
              </label>
            </div>
            <button className="button" type="button">
              Save draft
            </button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
