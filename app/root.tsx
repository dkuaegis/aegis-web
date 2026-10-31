import type { LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { AuthIntentRedirect } from "./components/AuthIntentRedirect";
import BrowserRedirectPage from "./components/BrowserRedirectPage";
import { useExternalBrowser } from "./hooks/useExternalBrowser";
import { I18nProvider } from "./i18n";
import { t } from "./i18n/store";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/aegis-logo.ico" },
];

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
      {isInAppBrowser ? (
        <BrowserRedirectPage />
      ) : (
        <>
          <AuthIntentRedirect />
          <Outlet />
        </>
      )}
    </I18nProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (!notFound) console.error(error);

  // Rendered in place of App, so the I18nProvider is not available here.
  return (
    <main className="auth-continue-page">
      <p role="alert">
        {t(notFound ? "pages.notFound.title" : "pages.appError.title")}
      </p>
      {notFound ? (
        <a className="auth-continue-retry" href="/">
          {t("pages.notFound.home")}
        </a>
      ) : (
        <button
          className="auth-continue-retry"
          type="button"
          onClick={() => window.location.reload()}
        >
          {t("pages.appError.reload")}
        </button>
      )}
    </main>
  );
}

export function HydrateFallback() {
  return (
    <main
      className="app-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="app-loading__brand" aria-hidden="true">
        AEGIS
      </span>
      <span className="app-loading__spinner" aria-hidden="true" />
      <p className="app-loading__message">Loading your page...</p>
    </main>
  );
}
