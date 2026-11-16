/**
 * The shop's settings. Texts here are yours to change; the API and key come from the environment
 * (.env locally, the repository's variables in CI), so the same code builds any shop.
 */
export const shop = {
  name: "3D Print Koning",
  tagline: "3D-geprinte modellen, met liefde gemaakt.",
  locale: "nl-NL",
  apiBase: import.meta.env.PUBLIC_COMMERCUS_API ?? "https://api.commercus.nl",
  shopKey: import.meta.env.PUBLIC_COMMERCUS_KEY ?? "",
  /** Number of products on the homepage. */
  featured: 6,
};
