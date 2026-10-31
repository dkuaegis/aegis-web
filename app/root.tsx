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

  return (
    <main className="grid min-h-dvh place-content-center justify-items-start gap-5 bg-paper p-8 text-ink">
      <p className="m-0 font-wordmark text-[1.6rem] font-bold">AEGIS</p>
      <p role="alert" className="m-0 text-[1.375rem] font-[800]">
        {t(
          notFound ? "common.states.notFoundTitle" : "common.states.errorTitle"
        )}
      </p>
      {notFound ? (
        <a
          className="font-[750] text-blue underline-offset-4 hover:underline"
          href="/"
        >
          {t("common.states.goHome")}
        </a>
      ) : (
        <button
          type="button"
          className="cursor-pointer font-[750] text-blue underline-offset-4 hover:underline"
          onClick={() => window.location.reload()}
        >
          {t("common.states.reload")}
        </button>
      )}
    </main>
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
