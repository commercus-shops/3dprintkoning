import { formatPrice } from "@commercus/storefront";
import { useCart } from "@commercus/storefront/hooks/preact";
import { useState } from "preact/hooks";
import { storefront } from "../lib/storefront";

const problems: Record<string, string> = { UNAVAILABLE: "Niet meer te koop", INSUFFICIENT_STOCK: "Niet genoeg op voorraad" };

/** The cart page: lines, quantities, the subtotal, and on to the hosted checkout. */
export default function Cart() {
  const { cart, loading, update, remove, checkout } = useCart(storefront());
  const [busy, setBusy] = useState(false);
  if (loading) return <p>Even laden…</p>;
  if (!cart || cart.lines.length === 0) return <p>Je winkelwagen is leeg. <a href="/producten/">Bekijk de producten</a>.</p>;

  async function pay() {
    setBusy(true);
    try {
      await checkout();
    } catch {
      setBusy(false);
      alert("Afrekenen lukte niet. Probeer het opnieuw.");
    }
  }

  return (
    <div>
      <table class="lines">
        <thead><tr><th>Artikel</th><th>Aantal</th><th class="amount">Bedrag</th><th /></tr></thead>
        <tbody>
          {cart.lines.map((line) => (
            <tr key={line.id}>
              <td>
                {line.productTitle ?? "Artikel"} {line.variantTitle && <small>{line.variantTitle}</small>}
                {line.problem && <div class="problem">{problems[line.problem]}{line.available != null && ` (nog ${line.available})`}</div>}
              </td>
              <td>
                <input type="number" min={0} max={99} value={line.quantity} aria-label="Aantal"
                  onChange={(e) => update(line.id, Number((e.target as HTMLInputElement).value)).catch(() => alert("Dat aantal kan niet."))} />
              </td>
              <td class="amount">{line.lineTotal != null ? formatPrice(line.lineTotal) : "–"}</td>
              <td><button type="button" class="link" onClick={() => remove(line.id)}>Verwijderen</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><th colSpan={2}>Subtotaal</th><th class="amount">{formatPrice(cart.subtotal)}</th><th /></tr></tfoot>
      </table>
      <p class="note">Verzendkosten en betalen regel je in de volgende stap, bij de beveiligde checkout.</p>
      <button type="button" onClick={pay} disabled={!cart.ready || busy}>Afrekenen</button>
    </div>
  );
}
