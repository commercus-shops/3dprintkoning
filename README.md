# Commercus storefront template

A webshop on [Commercus](https://commercus.nl), the platform for small makers: an
[Astro](https://astro.build) site that is built to static files and served from any S3-style bucket.
Fork it, make it yours, and sell.

- Products, categories and images come from the Commercus storefront API when the site is built.
- Prices, stock and the cart are live in the browser, with
  [`@commercus/storefront`](https://github.com/commercus/storefront).
- Paying, the address and shipping happen on Commercus' hosted checkout (iDEAL and more through your
  own Mollie account): your site never touches personal or payment details.
- Order confirmations, invoices and shipping mails come from the platform.

## Your shop

1. Use this template ("Use this template" on GitHub, or a fork on your Forgejo).
2. Copy `.env.example` to `.env` and fill in your shop's public key (`pk_…`, in the Commercus admin
   under Winkel).
3. `npm install`, then `npm run dev`: your shop on <http://localhost:4321>. For the cart to work
   there, add `localhost:4321` as a DEV domain of your shop in the admin (Winkel, Domeinen).
4. Change `src/shop.config.ts` and `src/styles/shop.css` to your own name and look.
5. Push: `.forgejo/workflows/deploy.yml` builds and deploys to your bucket (see its comments for the
   repository variables and secrets), on every push and every hour.

In the Commercus admin, set your shop's thank-you page to `https://<your domain>/bedankt/`.

## Working with an AI agent

The agent reads `AGENTS.md`; `prompts/` has example tasks. The rules there keep the shop safe: the
library for everything that touches the API, the hosted checkout for paying, no prices in code.

MIT licensed.
