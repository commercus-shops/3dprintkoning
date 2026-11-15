import { formatPrice } from "@commercus/storefront";
import { useOrder } from "@commercus/storefront/hooks/preact";
import { storefront } from "../lib/storefront";

/** The order the checkout sent the buyer back with (`?order=…&token=…`), and its invoice. */
export default function ThankYou() {
  const query = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const id = query.get("order");
  const token = query.get("token");
  const shop = storefront();
  const { data: order } = useOrder(shop, id, token);
  if (!order || !id || !token) return null;
  return (
    <section>
      <h2>Bestelling {order.number}</h2>
      <table class="lines">
        <tbody>
          {order.lines.map((line, i) => (
            <tr key={i}>
              <td>{line.quantity} × {line.productTitle}{line.variantTitle && ` (${line.variantTitle})`}</td>
              <td class="amount">{formatPrice(line.lineGross)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><th>Totaal (incl. verzending en btw)</th><th class="amount">{formatPrice(order.totalGross)}</th></tr></tfoot>
      </table>
      <button type="button" class="secondary" onClick={() => shop.downloadInvoice(id, token).catch(() => alert("De factuur is er nog niet; probeer het zo nog eens."))}>
        Factuur downloaden
      </button>
    </section>
  );
}
