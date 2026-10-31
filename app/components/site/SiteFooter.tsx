import { useI18n } from "@app/i18n";
import { Link } from "react-router";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { label: "Email", href: "mailto:dankook.aegis@gmail.com" },
  { label: "GitHub", href: "https://github.com/dkuaegis" },
  { label: "Instagram", href: "https://instagram.com/dku_aegis" },
] as const;

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="gutter-x grid items-end gap-8 border-t border-white/22 bg-ink py-8 text-white sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
      <div className="grid gap-2">
        <Link to="/" className="w-fit" aria-label={t("common.site.brandHome")}>
          <Wordmark className="text-[1.65rem] tracking-[-0.025em]" />
        </Link>
        <address className="text-[0.85rem] leading-relaxed text-white/78 not-italic">
          {t("common.address")}
        </address>
      </div>
      <nav
        aria-label={t("common.site.footerLinks")}
        className="flex flex-wrap gap-6"
      >
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="text-[0.82rem] font-bold transition-colors hover:text-[#95aeff]"
          >
            {link.label} ↗
          </a>
        ))}
      </nav>
    </footer>
  );
}
