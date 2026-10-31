import { RotateCwIcon } from "lucide-react";
import type { LinksFunction, MetaFunction } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import BrowserRedirectPage from "./components/BrowserRedirectPage";
import { StateMessage } from "./components/page/States";
import { Wordmark } from "./components/site/Wordmark";
import { buttonVariants } from "./components/ui/button";
import { Toaster } from "./components/ui/toast";
import { useExternalBrowser } from "./hooks/useExternalBrowser";
import { I18nProvider } from "./i18n";
import { t } from "./i18n/store";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/aegis-logo.ico" },
];

// Defaults for every page, and the only tags in the prerendered index.html
// that link-preview crawlers (which do not run JS) will see.
export const meta: MetaFunction = () => {
  const title = t("home.meta.title");
  const description = t("home.meta.description");
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#18181b" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Aegis" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // The provider rewrites this to the selected language on the client; "ko"
    // is the correct value for the prerendered markup.
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* docker/40-runtime-config.sh fills this in at container start.
            React leaves dangerouslySetInnerHTML content alone when hydrating,
            so the injected body does not count as a mismatch. */}
        {import.meta.env.PROD && (
          <script
            id="runtime-config"
            suppressHydrationWarning
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Empty placeholder; the container start script writes the body.
            dangerouslySetInnerHTML={{ __html: "" }}
          />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { isInAppBrowser } = useExternalBrowser();

  return (
    <I18nProvider>
      <Toaster>{isInAppBrowser ? <BrowserRedirectPage /> : <Outlet />}</Toaster>
    </I18nProvider>
  );
}

/**
 * Last resort when the app shell itself failed. Route errors are handled by
 * the site layout, which keeps the header and footer on screen.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (!notFound) console.error(error);

  // Rendered without the providers (they may be what failed), so it reads
  // translations from the store and uses plain links that reload the app.
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-white/18 bg-ink text-paper">
        <div className="frame-x flex min-h-(--header-height) items-center">
          <a
            href="/"
            aria-label={t("common.site.brandHome")}
            className="flex h-full items-center px-4 min-[821px]:px-[clamp(1.25rem,3vw,2.6rem)]"
          >
            <Wordmark />
          </a>
        </div>
      </header>
      <main className="flex-1">
        {notFound ? (
          <StateMessage
            size="page"
            eyebrow="404"
            title={t("common.states.notFoundTitle")}
            description={t("common.states.notFoundDescription")}
            action={
              <a href="/" className={buttonVariants({ variant: "ink" })}>
                {t("common.states.goHome")}
              </a>
            }
          />
        ) : (
          <StateMessage
            size="page"
            role="alert"
            eyebrow={t("common.states.errorEyebrow")}
            title={t("common.states.errorTitle")}
            description={t("common.states.crashDescription")}
            action={
              <>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={buttonVariants({ variant: "ink" })}
                >
                  <RotateCwIcon aria-hidden="true" />
                  {t("common.states.reload")}
                </button>
                <a href="/" className={buttonVariants({ variant: "outline" })}>
                  {t("common.states.goHome")}
                </a>
              </>
            }
          />
        )}
      </main>
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="app-loading" role="status" aria-busy="true">
      <span className="app-loading__brand">AEGIS</span>
      <span className="app-loading__bar" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
