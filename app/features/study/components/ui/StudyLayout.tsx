import { useI18n } from "@app/i18n";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

export function useStudyUiText() {
  const { language } = useI18n();
  return (ko: string, en: string) => (language === "en" ? en : ko);
}

export default function StudyLayout({
  children,
  title,
  meta,
  actions,
  onBack,
  backLabel,
  wide = false,
}: {
  children: ReactNode;
  title?: string;
  meta?: string;
  actions?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  wide?: boolean;
}) {
  const ui = useStudyUiText();
  return (
    <div className="service-page">
      <a className="service-skip-link" href="#study-main">
        {ui("본문으로 바로가기", "Skip to content")}
      </a>
      <Header />
      <main
        id="study-main"
        className={wide ? "service-main service-main-wide" : "service-main"}
      >
        {onBack && (
          <nav
            className="service-back-navigation"
            aria-label={ui("이전 화면", "Back navigation")}
          >
            <button className="back-button" type="button" onClick={onBack}>
              <ArrowLeft aria-hidden="true" />
              {backLabel ?? ui("스터디 상세", "Study details")}
            </button>
          </nav>
        )}
        {(title || meta || actions) && (
          <header className="service-titlebar">
            <div className="service-title-copy">
              {meta && <p className="service-meta">{meta}</p>}
              {title && <h1>{title}</h1>}
            </div>
            {actions && <div className="service-actions">{actions}</div>}
          </header>
        )}
        {children}
      </main>
      <footer className="study-site-footer">
        <div className="study-site-footer-brand">
          <Link to="/#top">AEGIS</Link>
          <address>
            {ui(
              "단국대학교 죽전캠퍼스 혜당관 530호",
              "Room 530, Hyedang Hall, Dankook University Jukjeon Campus"
            )}
          </address>
        </div>
        <nav aria-label={ui("소셜 및 문의 링크", "Social and contact links")}>
          <a href="mailto:dankook.aegis@gmail.com">Email ↗</a>
          <a
            href="https://github.com/dkuaegis"
            target="_blank"
            rel="noreferrer"
          >
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
    </div>
  );
}

export function StudyLoading({ label }: { label: string }) {
  return (
    <div className="empty-state service-loading" role="status" aria-busy="true">
      <span className="service-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function StudyEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">
        ↗
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </section>
  );
}

export function StudyError({ message }: { message: string }) {
  return (
    <section className="error-state" role="alert">
      <strong>{message}</strong>
    </section>
  );
}
