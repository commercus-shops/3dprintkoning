import { createStorefront, type Storefront } from "@commercus/storefront";
import { shop } from "../shop.config";

let browser: Storefront | undefined;

/** The storefront in the browser: one per page, shared by every island, the cart kept in localStorage. */
export function storefront(): Storefront {
  browser ??= createStorefront({ apiBase: shop.apiBase, shopKey: shop.shopKey });
  return browser;
}
