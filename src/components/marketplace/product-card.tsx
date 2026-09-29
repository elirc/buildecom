import { formatMoney } from "@/domain/checkout/money";
import type { ProductCardView } from "@/types/marketplace";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

export function ProductCard({ product }: { product: ProductCardView }) {
  const stockClass = product.stock === 0 ? "danger" : product.stock <= 3 ? "warning" : "success";
  const stockLabel = product.stock === 0 ? "Sold out" : product.stock <= 3 ? `${product.stock} left` : "In stock";
  const productHref = `/products/${product.slug}` as Route;

  return (
    <article className="product-card">
      <Image
        className="product-image"
        src={product.primaryImageUrl}
        alt={product.title}
        width={640}
        height={480}
      />
      <div className="product-body">
        <div className="row">
          <h3 style={{ margin: 0 }}>{product.title}</h3>
          <span className="price">{formatMoney(product.priceCents)}</span>
        </div>
        <p className="muted small" style={{ margin: 0 }}>
          {product.sellerName}
        </p>
        <div className="row">
          <span className={`chip ${stockClass}`}>{stockLabel}</span>
          <span className="muted small">{product.ratingAverage.toFixed(1)} rating</span>
        </div>
        <Link className="button secondary" href={productHref}>
          View product
        </Link>
      </div>
    </article>
  );
}
