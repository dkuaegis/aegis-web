import { useI18n } from "@app/i18n";
import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

export function HomeFooter() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;

    event.preventDefault();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", "#top");
  };

  return (
    <footer className="home-site-footer" id="footer">
      <div className="home-site-footer-brand">
        <Link to="/#top" onClick={scrollToTop}>
          AEGIS
        </Link>
        <address>{t("common.address")}</address>
      </div>
      <nav aria-label={t("home.footer.linksLabel")}>
        <a href="mailto:dankook.aegis@gmail.com">Email ↗</a>
        <a href="https://github.com/dkuaegis" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a
          href="https://instagram.com/dku_aegis"
          target="_blank"
          rel="noreferrer"
        >
          Instagram ↗
        </a>
      </nav>
    </footer>
  );
}
