import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";

// Static: the whole shop is built to dist/ and served from a bucket. Product pages come from the
// storefront API at build time and are refreshed from it in the browser, as are prices, stock and the
// cart (src/islands); a product without a page yet is shown by the 404 page.
export default defineConfig({
  site: process.env.SITE_URL || "https://example.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [preact()],
});
