import { AppShell } from "@/components/shell/app-shell";
import { formatMoney } from "@/domain/checkout/money";
import { getProductDetails } from "@/server/catalog/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return (
    <AppShell active="marketplace">
      <main className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">{product.category}</p>
            <h1>{product.title}</h1>
            <p>
              Sold by {product.seller.name} from {product.seller.location}
            </p>
          </div>
          <strong className="price">{formatMoney(product.priceCents)}</strong>
        </div>

        <section className="market-grid">
          <Image
            className="product-image surface"
            src={product.primaryImageUrl}
            alt={product.title}
            width={900}
            height={675}
            priority
          />
          <div className="surface panel stack">
            <p>{product.description}</p>
            <div className="row">
              <span className="chip success">{product.stock} available</span>
              <span className="muted small">
                {product.ratingAverage.toFixed(1)} rating across {product.reviewCount} reviews
              </span>
            </div>
            <button className="button" type="button">
              Add to cart
            </button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
