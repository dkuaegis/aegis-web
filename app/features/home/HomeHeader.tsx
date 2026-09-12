import { LanguageToggle, useI18n } from "@app/i18n";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../api/auth";
import { googleLoginUrl } from "../../lib/api";

interface HomeHeaderProps {
  authUser: AuthUser;
  loading: boolean;
}

export function HomeHeader({ authUser, loading }: HomeHeaderProps) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const items = !authUser.isAuthenticated
    ? [
        { label: t("home.nav.login"), href: googleLoginUrl },
        {
          label: t("home.nav.join"),
          href: "/auth/continue?intent=join",
          emphasis: true,
        },
      ]
    : authUser.status === "PENDING"
      ? [{ label: t("home.nav.join"), href: "/join", emphasis: true }]
      : [
          { label: t("home.nav.study"), href: "/study" },
          { label: t("home.nav.mypage"), href: "/mypage" },
        ];

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="home-site-header">
      <Link
        className="home-site-brand"
        to="/"
        aria-label={t("home.nav.brandHome")}
        onClick={() => setMenuOpen(false)}
      >
        AEGIS
      </Link>

      <div className="home-site-header-actions">
        <LanguageToggle className="home-site-language" />

        <button
          className="home-site-menu-button"
          type="button"
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("common.closeMenu") : t("common.openMenu")}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id={menuId}
        className={[
          "home-site-navigation",
          menuOpen ? "is-open" : "",
          loading ? "is-loading" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={t("common.mainMenu")}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={item.emphasis ? "is-emphasis" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
