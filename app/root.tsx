import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { checkAuth } from "./api/auth";
import { AuthIntentRedirect } from "./components/AuthIntentRedirect";
import BrowserRedirectPage from "./components/BrowserRedirectPage";
import { useExternalBrowser } from "./hooks/useExternalBrowser";
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

  if (isInAppBrowser) {
    return <BrowserRedirectPage />;
  }

  return (
    <>
      <AuthIntentRedirect />
      <Outlet />
    </>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
