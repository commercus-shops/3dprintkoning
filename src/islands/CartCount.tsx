import { useCart } from "@commercus/storefront/hooks/preact";
import { storefront } from "../lib/storefront";

/** The number of items in the cart, in the header; nothing while it is empty. */
export default function CartCount() {
  const { count } = useCart(storefront());
  return count > 0 ? <span class="badge">{count}</span> : null;
}
