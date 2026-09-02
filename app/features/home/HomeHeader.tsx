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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const items = !authUser.isAuthenticated
    ? [
        { label: "로그인", href: googleLoginUrl },
        {
          label: "가입하기",
          href: "/auth/continue?intent=join",
          emphasis: true,
        },
      ]
    : authUser.status === "PENDING"
      ? [{ label: "가입하기", href: "/join", emphasis: true }]
      : [
          { label: "스터디", href: "/study" },
          { label: "마이페이지", href: "/mypage" },
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
        aria-label="AEGIS 홈"
        onClick={() => setMenuOpen(false)}
      >
        AEGIS
      </Link>

      <button
        className="home-site-menu-button"
        type="button"
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <nav
        id={menuId}
        className={[
          "home-site-navigation",
          menuOpen ? "is-open" : "",
          loading ? "is-loading" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="주요 메뉴"
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
