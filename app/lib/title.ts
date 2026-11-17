/** The club's official name. The all-caps "AEGIS" is only the logo. */
export const SITE_NAME = "Aegis";

/**
 * The production origin. Link-preview and search crawlers need absolute URLs,
 * and the prerendered markup is the same file in every environment, so other
 * environments also name production as the canonical site.
 */
export const SITE_URL = "https://dkuaegis.org";

/** Browser tab title for a page inside the site. */
export function pageTitle(name: string): string {
  return `${name} | ${SITE_NAME}`;
}
