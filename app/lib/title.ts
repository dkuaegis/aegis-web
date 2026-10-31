/** The club's official name. The all-caps "AEGIS" is only the logo. */
export const SITE_NAME = "Aegis";

/** Browser tab title for a page inside the site. */
export function pageTitle(name: string): string {
  return `${name} | ${SITE_NAME}`;
}
