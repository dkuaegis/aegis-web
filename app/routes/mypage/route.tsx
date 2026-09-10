import { LanguageToggle, useI18n } from "@app/i18n";
import MypageApp from "@mypage/App";
import { initGoogleAnalytics } from "@mypage/utils/analytics";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@mypage/index.css";

initGoogleAnalytics();

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/study", label: "STUDY" },
  { href: "/mypage", label: "MYPAGE" },
] as const;

function MypageSiteHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="mypage-site-header">
        <div className="mypage-site-header-inner">
          <Link to="/" className="mypage-site-logo">
            AEGIS
          </Link>

          <div className="mypage-site-header-actions">
            <nav className="mypage-site-nav" aria-label={t("common.mainMenu")}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`mypage-site-nav-link${
                    link.href === "/mypage" ? " is-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <LanguageToggle className="mypage-site-language" size="compact" />

            <button
              type="button"
              className="mypage-site-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("common.openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mypage-site-mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mypage-site-mobile-menu"
        className={`mypage-site-mobile-menu${menuOpen ? " is-open" : ""}`}
      >
        <div className="mypage-site-mobile-menu-header">
          <Link
            to="/"
            className="mypage-site-logo"
            onClick={() => setMenuOpen(false)}
          >
            AEGIS
          </Link>
          <button
            type="button"
            className="mypage-site-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label={t("common.closeMenu")}
          >
            <span aria-hidden="true">X</span>
          </button>
        </div>

        <nav
          className="mypage-site-mobile-nav"
          aria-label={t("common.mobileMainMenu")}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`mypage-site-mobile-link${
                link.href === "/mypage" ? " is-active" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className={`mypage-site-menu-overlay${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-label={t("common.closeMenu")}
      />
    </>
  );
}

export default function MypageRoute() {
  useEffect(() => {
    document.body.classList.add("mypage-body");
    return () => {
      document.body.classList.remove("mypage-body");
    };
  }, []);

  return (
    <div className="mypage-shell">
      <MypageSiteHeader />
      <main className="mypage" id="root">
        <MypageApp />
      </main>
    </div>
  );
}
