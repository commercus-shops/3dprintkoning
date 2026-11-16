import { type Product, StorefrontError } from "@commercus/storefront";
import { useEffect, useState } from "preact/hooks";
import { storefront } from "../lib/storefront";
import VariantPicker from "./VariantPicker";

interface Props {
  /** The product as the build (or the 404 page) saw it. */
  initial: Product;
  /** Its description as HTML, rendered from Markdown at build time; empty to render it here. */
  descriptionHtml: string;
}

/** Markdown to HTML in the browser, only when the description changed since the build. */
async function render(markdown: string | null | undefined): Promise<string> {
  if (!markdown) return "";
  const { marked } = await import("marked");
  return marked.parse(markdown);
}

/**
 * A product page: gallery, title, the variant choice and the description. Built into the page, then
 * checked against the API in the browser, so a change in the admin shows before the next build and a
 * product that was removed says so instead of being sold.
 */
export default function ProductView({ initial, descriptionHtml }: Props) {
  const [product, setProduct] = useState(initial);
  const [description, setDescription] = useState(descriptionHtml);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!descriptionHtml && initial.description) render(initial.description).then(setDescription, () => {});
    storefront().product(initial.slug).then(
      (live) => {
        setProduct(live);
        if (live.description !== initial.description) render(live.description).then(setDescription, () => {});
      },
      (error: unknown) => {
        if (error instanceof StorefrontError && error.status === 404) setGone(true);
      },
    );
  }, [initial.slug]);

  if (gone) {
    return (
      <article>
        <h1>{initial.title}</h1>
        <p>Dit product is niet meer leverbaar. <a href="/producten/">Bekijk onze andere producten</a>.</p>
      </article>
    );
  }
  return (
    <article class="product">
      <div class="gallery">
        {product.images.length > 0 ? (
          product.images.map((image, i) => (
            <img key={image.url} src={image.url} alt={image.alt ?? product.title} width={image.width} height={image.height} loading={i === 0 ? "eager" : "lazy"} />
          ))
        ) : (
          <div class="placeholder" aria-hidden="true">✦</div>
        )}
      </div>
      <div>
        <h1>{product.title}</h1>
        <VariantPicker key={product.variants.map((v) => v.id).join(",")} product={product} />
        <div class="description" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </article>
  );
}
