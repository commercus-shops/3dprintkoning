import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";

// Static: the whole shop is built to dist/ and served from a bucket. Product pages come from the
// storefront API at build time; prices, stock and the cart are live in the browser (src/islands).
export default defineConfig({
  site: process.env.SITE_URL || "https://example.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [preact()],
});
