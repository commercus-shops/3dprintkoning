import { formatPrice, type Product, StorefrontError } from "@commercus/storefront";
import { useCart, usePrices } from "@commercus/storefront/hooks/preact";
import { useState } from "preact/hooks";
import { storefront } from "../lib/storefront";

/**
 * The product page's choice: a value per option, then the chosen variant's price and stock, live
 * from the API (the page may be hours old), and the button that puts it in the cart.
 */
export default function VariantPicker({ product }: { product: Product }) {
  const shop = storefront();
  const { add } = useCart(shop);
  const prices = usePrices(shop, product.variants.map((v) => v.id));
  const [values, setValues] = useState(product.variants[0]?.optionValues ?? []);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const variant = product.variants.find((v) => v.optionValues.every((value, i) => value === values[i])) ?? product.variants[0];
  if (!variant) return <p>Dit product is nu niet te koop.</p>;
  const live = prices.data?.[variant.id];
  const available = live ? live.available : variant.available;
  const stock = live ? live.stock : variant.stock;

  async function buy(event: Event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await add(variant!.id, quantity);
      setMessage("added");
    } catch (error) {
      setMessage(error instanceof StorefrontError && error.outOfStock ? "Er zijn er niet genoeg meer op voorraad." : "Dat lukte niet. Probeer het opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form class="buy" onSubmit={buy}>
      <p class="price">{formatPrice(live?.priceGross ?? variant.priceGross)}</p>
      {product.options.map((option, i) => (
        <label key={option.name}>
          {option.name}
          <select value={values[i]} onChange={(e) => setValues(values.map((v, j) => (j === i ? (e.target as HTMLSelectElement).value : v)))}>
            {option.values.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      ))}
      <label>
        Aantal
        <input type="number" min={1} max={99} value={quantity} onInput={(e) => setQuantity(Number((e.target as HTMLInputElement).value) || 1)} />
      </label>
      <p class="stock">{!available ? "Uitverkocht" : stock == null ? "Wordt voor je gemaakt" : stock <= 5 ? `Nog ${stock} op voorraad` : "Op voorraad"}</p>
      <button type="submit" disabled={!available || busy}>In winkelwagen</button>
      <p class="message" aria-live="polite">
        {message === "added" ? <>Toegevoegd. <a href="/winkelwagen/">Naar je winkelwagen</a></> : message}
      </p>
    </form>
  );
}
