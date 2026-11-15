# Instructions for AI agents

This is a webshop on the Commercus platform, built with Astro: a static site, served from a bucket.
Products come from the Commercus storefront API when the site is built; prices, stock and the cart
are live in the browser. Every push to `main` builds the site and puts it live (Forgejo), and so does
a build every hour.

## How the shop works

- **`src/shop.config.ts`**: the shop's name, tagline and the like. The API and the shop's key come from
  the environment (`.env` locally, the repository's variables in CI).
- **Products** are pages made at build time from the API (`src/pages/producten/[slug].astro`, from
  `src/lib/catalog.ts`). Never write product pages or prices by hand: the owner adds products in the
  Commercus admin, and the next build shows them.
- **Islands** (`src/islands/`, Preact) are the parts that run in the browser: the cart count, the
  choice of variant with its live price and stock, the cart page, the thank-you page.
- **Look**: `src/styles/shop.css`. Change the tokens at the top first (colours, font, radius).
- **Frame of every page**: `src/layouts/Base.astro`.

## Always

- Talk to the API only through `@commercus/storefront` (`src/lib/storefront.ts` in the browser,
  `src/lib/catalog.ts` at build time). Write no `fetch` of your own against it.
- Checkout ALWAYS goes through `checkout()` from the library: a redirect to the platform's hosted
  checkout. Never build a payment, address or customer-details form.
- Never hardcode prices or stock: they come from the API.
- Test locally with `npm run dev` before you commit; `npm run build` must succeed.
- Keep texts in Dutch, unless the shop owner asks otherwise.

## Never

- No secrets, `sk_` tokens or passwords in the repository. Only the public `pk_` key is used, and it
  comes from the environment.
- No trackers or external scripts without weighing the cookie banner (`docs/regels.md`).
- Do not change `.forgejo/workflows/` unless the shop owner explicitly asks for it.

## Useful

- API and library: `docs/api.md`.
- Example tasks: `prompts/`.
- Deploying = commit and push to `main`.
