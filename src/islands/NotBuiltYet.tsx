import type { Category, Product } from "@commercus/storefront";
import { useEffect, useState } from "preact/hooks";
import { storefront } from "../lib/storefront";
import { shop } from "../shop.config";
import ProductGrid from "./ProductGrid";
import ProductView from "./ProductView";

type Found = { product: Product } | { category: Category } | null;

/**
 * The 404 page's look in the API: a product or category added in the admin has no page until the
 * site is rebuilt, so the bucket answers with this page. Here it is shown from the API instead; for
 * anything else, and without JavaScript, the page stays "Niet gevonden".
 */
export default function NotBuiltYet() {
  const [found, setFound] = useState<Found>(null);

  useEffect(() => {
    const [, kind, slug] = window.location.pathname.match(/^\/(producten|categorie)\/([^/]+)\/?$/) ?? [];
    if (!slug) return;
    const api = storefront();
    if (kind === "producten") {
      api.product(decodeURIComponent(slug)).then((product) => {
        document.title = `${product.title} · ${shop.name}`;
        setFound({ product });
      }, () => {});
    } else {
      api.categories().then((categories) => {
        const category = categories.find((c) => c.slug === decodeURIComponent(slug));
        if (!category) return;
        document.title = `${category.name} · ${shop.name}`;
        setFound({ category });
      }, () => {});
    }
  }, []);

  if (found && "product" in found) return <ProductView initial={found.product} descriptionHtml="" />;
  if (found && "category" in found) {
    return (
      <>
        <h1>{found.category.name}</h1>
        {found.category.description && <p>{found.category.description}</p>}
        <ProductGrid initial={[]} category={found.category.slug} empty="Hier staan nog geen producten." />
      </>
    );
  }
  return (
    <>
      <h1>Niet gevonden</h1>
      <p>Deze pagina bestaat niet (meer). <a href="/">Naar de homepage</a>.</p>
    </>
  );
}
