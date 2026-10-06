import { LanguageToggle, useI18n } from "@app/i18n";
import { Menu, X } from "lucide-react";
import { memo, useEffect, useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const { t, language } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="study-site-header">
      <Link
        className="study-site-brand"
        to="/"
        aria-label="AEGIS"
        onClick={() => setMenuOpen(false)}
      >
        AEGIS
      </Link>
      <div className="study-header-language">
        <LanguageToggle className="study-language" size="compact" />
      </div>
      <button
        className="study-site-menu-button"
        type="button"
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-label={t(menuOpen ? "common.closeMenu" : "common.openMenu")}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id={menuId}
        className={
          menuOpen ? "study-site-navigation is-open" : "study-site-navigation"
        }
        aria-label={language === "en" ? "Main navigation" : "주요 메뉴"}
      >
        <NavLink
          to="/study"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setMenuOpen(false)}
        >
          {language === "en" ? "Studies" : "스터디"}
        </NavLink>
        <NavLink to="/mypage" onClick={() => setMenuOpen(false)}>
          {language === "en" ? "My page" : "마이페이지"}
        </NavLink>
      </nav>
    </header>
  );
};

export default memo(Header);
