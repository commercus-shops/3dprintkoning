import { formatPrice, type ProductSummary } from "@commercus/storefront";

/** A product in a list: image, title, the lowest price, and whether it is sold out. */
export default function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <a class="card" href={`/producten/${product.slug}/`}>
      {product.image ? (
        <img src={product.image.url} alt={product.image.alt ?? product.title} width={product.image.width} height={product.image.height} loading="lazy" />
      ) : (
        <div class="placeholder" aria-hidden="true">✦</div>
      )}
      <span class="title">{product.title}</span>
      <span class="price">vanaf {formatPrice(product.priceFrom)}</span>
      {!product.available && <span class="soldout">Uitverkocht</span>}
    </a>
  );
}
