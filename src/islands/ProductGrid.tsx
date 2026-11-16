import type { ProductSummary } from "@commercus/storefront";
import { useEffect, useState } from "preact/hooks";
import { storefront } from "../lib/storefront";
import ProductCard from "./ProductCard";

interface Props {
  /** The list as the build saw it: rendered into the page, and shown until the API answers. */
  initial: ProductSummary[];
  /** Only the products in this category. */
  category?: string;
  /** At most this many, e.g. on the homepage. */
  limit?: number;
  /** A heading above the grid, and a link below it; left out when there are no products. */
  heading?: string;
  more?: { href: string; label: string };
  /** The text when there are no products; without it, nothing is shown. */
  empty?: string;
}

/**
 * A list of products, built into the page and then refreshed from the API in the browser: a product
 * added, changed or removed in the admin shows here at once, before the site is rebuilt. When the API
 * cannot be reached the built list stays.
 */
export default function ProductGrid({ initial, category, limit, heading, more, empty }: Props) {
  const [products, setProducts] = useState(initial);
  useEffect(() => {
    storefront().products(category ? { category } : undefined).then(setProducts, () => {});
  }, [category]);

  const shown = limit ? products.slice(0, limit) : products;
  if (shown.length === 0) return empty ? <p>{empty}</p> : null;
  return (
    <>
      {heading && <h2>{heading}</h2>}
      <div class="grid">{shown.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      {more && <p><a href={more.href}>{more.label}</a></p>}
    </>
  );
}
