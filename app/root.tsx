import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { checkAuth } from "./api/auth";
import { AuthIntentRedirect } from "./components/AuthIntentRedirect";
import BrowserRedirectPage from "./components/BrowserRedirectPage";
import { useExternalBrowser } from "./hooks/useExternalBrowser";
import { I18nProvider } from "./i18n";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/aegis-logo.ico" },
];

export async function loader() {
  const user = await checkAuth();
  return { user };
}

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

export function HydrateFallback() {
  return <p>Loading...</p>;
}
