# De storefront-API en de bibliotheek

De site praat met Commercus via [`@commercus/storefront`](https://github.com/commercus/storefront),
nooit met eigen `fetch`-code.

## Bij het bouwen

`src/lib/catalog.ts` leest de producten, hun details en de categorieën, en `getStaticPaths` maakt er
pagina's van. Zonder sleutel of zonder API bouwt de site zonder producten.

## In de browser (islands)

```tsx
import { useCart, usePrices } from "@commercus/storefront/hooks/preact";
import { storefront } from "../lib/storefront";

const { cart, count, add, update, remove, checkout } = useCart(storefront());
```

| Aanroep | Wat het doet |
| --- | --- |
| `useCart(shop)` | De winkelwagen, overal gelijk; `add`, `update`, `remove`, `checkout` |
| `usePrices(shop, ids)` | Prijs en voorraad van vandaag per variant |
| `useOrder(shop, id, token)` | De bestelling op de bedankpagina |
| `shop.downloadInvoice(id, token)` | De factuur als pdf |

Prijzen zijn in euro's, inclusief btw (`formatPrice` maakt er `€ 12,50` van). Een fout is een
`StorefrontError`; `error.outOfStock` betekent: niet genoeg op voorraad.
