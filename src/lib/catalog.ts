/**
 * The catalogue as the build sees it: read from the storefront API once per build, product pages
 * made from it. Without a key, or when the API cannot be reached, the build goes on with an empty
 * shop and a warning: the site is still published, and the next build fills it.
 */
import { createStorefront, type Category, type Product, type ProductSummary } from "@commercus/storefront";
import { shop } from "../shop.config";

export interface Catalog {
  products: ProductSummary[];
  details: Map<string, Product>;
  categories: Category[];
}

let loading: Promise<Catalog> | undefined;

export function catalog(): Promise<Catalog> {
  loading ??= load();
  return loading;
}

async function load(): Promise<Catalog> {
  const empty: Catalog = { products: [], details: new Map(), categories: [] };
  if (!shop.shopKey) {
    console.warn("[catalog] PUBLIC_COMMERCUS_KEY is not set: building without products");
    return empty;
  }
  const api = createStorefront({ apiBase: shop.apiBase, shopKey: shop.shopKey, storage: null });
  try {
    const [products, categories] = await Promise.all([api.products(), api.categories()]);
    const details = new Map<string, Product>();
    for (const summary of products) details.set(summary.slug, await api.product(summary.slug));
    return { products, details, categories };
  } catch (error) {
    console.warn(`[catalog] Could not read the catalogue from ${shop.apiBase}: ${error}`);
    return empty;
  }
}
