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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="mypage-site-header">
        <div className="mypage-site-header-inner">
          <Link to="/" className="mypage-site-logo">
            AEGIS
          </Link>

          <nav className="mypage-site-nav" aria-label="주요 메뉴">
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

          <button
            type="button"
            className="mypage-site-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            aria-controls="mypage-site-mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
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
            aria-label="메뉴 닫기"
          >
            <span aria-hidden="true">X</span>
          </button>
        </div>

        <nav className="mypage-site-mobile-nav" aria-label="모바일 주요 메뉴">
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
        aria-label="메뉴 닫기"
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
