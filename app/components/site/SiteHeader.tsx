import { LanguageToggle, useI18n } from "@app/i18n";
import { loginPath } from "@app/lib/auth";
import { useSession } from "@app/lib/session";
import { cn } from "@app/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Wordmark } from "./Wordmark";

interface NavItem {
  label: string;
  to: string;
  emphasis?: boolean;
}

function useNavItems(): NavItem[] | null {
  const { t } = useI18n();
  const session = useSession();
  const { pathname, search } = useLocation();

  if (session.state !== "ready") return null;

  switch (session.status) {
    case "anonymous":
      return [
        { label: t("common.site.nav.login"), to: loginPath(pathname + search) },
        {
          label: t("common.site.nav.join"),
          to: loginPath("/join"),
          emphasis: true,
        },
      ];
    case "guest":
      return [
        {
          label: t("common.site.nav.continueJoin"),
          to: "/join",
          emphasis: true,
        },
      ];
    case "member":
      return [
        { label: t("common.site.nav.study"), to: "/study" },
        { label: t("common.site.nav.mypage"), to: "/mypage" },
      ];
  }
}

export function SiteHeader() {
  const { t } = useI18n();
  const items = useNavItems();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 grid min-h-(--header-height) grid-cols-[minmax(0,1fr)_auto] items-stretch border-b border-white/18 bg-ink/98 text-paper backdrop-blur-md min-[821px]:grid-cols-[minmax(0,1fr)_auto_auto]">
      <a
        href="#main"
        className="fixed top-0 left-4 z-50 -translate-y-[120%] bg-paper px-4 py-3 text-[0.8125rem] font-[800] text-ink transition-transform focus:translate-y-0"
      >
        {t("common.site.skipLink")}
      </a>

      <Link
        to="/"
        aria-label={t("common.site.brandHome")}
        className="flex w-fit items-center px-4 min-[821px]:px-[clamp(1.25rem,3vw,2.6rem)]"
      >
        <Wordmark />
      </Link>

      <div className="flex items-center gap-2 pl-3 min-[821px]:px-[0.9rem]">
        <LanguageToggle className="[--lang-toggle-surface:var(--ink)]" />
        <button
          type="button"
          className="grid h-full w-[60px] cursor-pointer place-items-center border-l border-white/16 min-[821px]:hidden"
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("common.closeMenu") : t("common.openMenu")}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <XIcon aria-hidden="true" className="size-5" />
          ) : (
            <MenuIcon aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      <nav
        id={menuId}
        aria-label={t("common.mainMenu")}
        className={cn(
          "absolute inset-x-0 top-full flex-col border-t border-white/16 bg-ink",
          menuOpen ? "flex" : "hidden",
          "min-[821px]:static min-[821px]:flex min-[821px]:flex-row min-[821px]:border-t-0 min-[821px]:border-l min-[821px]:bg-transparent",
          !items && "invisible min-[821px]:min-w-56"
        )}
      >
        {items?.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex min-h-[3.8rem] items-center border-b border-white/12 px-5 text-base font-[780] min-[821px]:text-[0.875rem] transition-colors hover:bg-white/9 hover:text-white",
                "min-[821px]:min-h-0 min-[821px]:w-28 min-[821px]:justify-center min-[821px]:border-r min-[821px]:border-b-0 min-[821px]:border-white/16 min-[821px]:px-4",
                item.emphasis ? "text-[#83a0ff]" : "text-paper",
                isActive &&
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-paper max-[820px]:after:inset-y-0 max-[820px]:after:right-auto max-[820px]:after:h-auto max-[820px]:after:w-[3px]"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
