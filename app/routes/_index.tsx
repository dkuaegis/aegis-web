import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { type AuthUser, checkAuth } from "../api/auth";
import { HomeFooter } from "../features/home/HomeFooter";
import { HomeHeader } from "../features/home/HomeHeader";
import { googleLoginUrl } from "../lib/api";

import "../features/home/home-page.css";

export function meta() {
  // `meta` runs outside the component tree, so it reads the language from the
  // store rather than from context.
  return [
    { title: translate("home.meta.title") },
    { name: "description", content: translate("home.meta.description") },
  ];
}

const PARTNERS = [
  { key: "swProject", href: "https://swcu.dankook.ac.kr/home" },
  { key: "clubUnion", href: "https://www.instagram.com/dku_weave" },
  { key: "hspace", href: "https://hspace.io" },
  { key: "theori", href: "https://theori.io/ko" },
] as const;

const ACTIVITIES = [
  { key: "study", tag: "Learn" },
  { key: "devTeam", tag: "Build" },
  { key: "codeClub", tag: "Share" },
  { key: "seminar", tag: "Listen" },
  { key: "securityTeam", tag: "Secure" },
  { key: "techTalk", tag: "Speak" },
] as const;

const FAQ_KEYS = [
  "eligibility",
  "beginners",
  "activities",
  "fee",
  "room",
  "more",
] as const;

function ExternalMark() {
  return <ArrowUpRight aria-hidden="true" />;
}

function GrowthOrb() {
  return (
    <div className="home-hero-orb" aria-hidden="true">
      <div className="home-orb-sphere">
        <span className="home-orb-color is-blue" />
        <span className="home-orb-color is-coral" />
        <span className="home-orb-color is-green" />
        <span className="home-orb-refraction" />
        <span className="home-orb-glint" />
      </div>
      <span className="home-orb-shadow" />
    </div>
  );
}

function scrollToHomeSection(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string
) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  event.preventDefault();
  section.scrollIntoView({ behavior: "smooth" });
  window.history.replaceState(null, "", `#${sectionId}`);
}

export default function HomePage() {
  const { t } = useI18n();
  const [authUser, setAuthUser] = useState<AuthUser>({
    isAuthenticated: false,
    status: null,
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then(setAuthUser)
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (sectionId !== "activity" && sectionId !== "faq") return;

    const animationFrame = window.requestAnimationFrame(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const isMember = authUser.status === "COMPLETED";
  const isGuest = authUser.status === "PENDING";
  const joinHref = isGuest ? "/join" : "/auth/continue?intent=join";
  const memberActions = [
    { label: t("home.actions.browseStudies"), href: "/study" },
    { label: t("home.actions.myActivity"), href: "/mypage" },
  ];
  const primaryAction = isMember
    ? (memberActions[0] ?? {
        label: t("home.actions.clubActivities"),
        href: "#activities",
      })
    : { label: t("home.actions.join"), href: joinHref };
  const secondaryAction = isMember
    ? (memberActions[1] ?? {
        label: t("home.actions.joinInfo"),
        href: "#faq",
      })
    : { label: t("home.actions.joinInfo"), href: "#faq" };

  return (
    <div className="home-page" id="top">
      <Link
        className="home-skip-link"
        to="#main-content"
        onClick={(event) => scrollToHomeSection(event, "main-content")}
      >
        {t("home.skipLink")}
      </Link>

      <HomeHeader authUser={authUser} loading={authLoading} />

      <main id="main-content">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-hero-main">
            <h1 id="hero-title">
              {t("home.hero.titleLine1")}
              <br />
              {t("home.hero.titleLine2Lead")}
              <em>{t("home.hero.titleLine2Em")}</em>
              <br />
              {t("home.hero.titleLine3")}
              <span className="home-hero-period">.</span>
            </h1>

            <GrowthOrb />

            <div className="home-hero-summary">
              <p>
                {t("home.hero.summaryLead")}
                <strong>{t("home.hero.summaryStrong")}</strong>
                {t("home.hero.summaryTail")}
              </p>
              <div className="home-hero-actions">
                <a href={primaryAction.href}>
                  {primaryAction.label} <ExternalMark />
                </a>
                <Link
                  to={secondaryAction.href}
                  onClick={
                    secondaryAction.href === "#faq"
                      ? (event) => scrollToHomeSection(event, "faq")
                      : undefined
                  }
                >
                  {secondaryAction.label}{" "}
                  {secondaryAction.href.startsWith("/") ? (
                    <ExternalMark />
                  ) : (
                    <ArrowDown aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>

            <div className="home-hero-divider" aria-hidden="true" />
          </div>
        </section>

        <section
          className="home-activities"
          id="activity"
          aria-labelledby="activities-title"
        >
          <header className="home-activities-header">
            <div>
              <h2 id="activities-title">
                <span className="home-activities-heading-word is-learning">
                  {t("home.activities.headingWord1")}
                </span>{" "}
                <span className="home-activities-heading-word is-making">
                  {t("home.activities.headingWord2")}
                </span>
                <br />
                <span className="home-activities-heading-word is-sharing">
                  {t("home.activities.headingWord3")}
                </span>
                {t("home.activities.headingSuffix")}
              </h2>
            </div>
          </header>

          <div className="home-activity-story">
            <ol className="home-activity-steps">
              {ACTIVITIES.map((activity, index) => (
                <li key={activity.key}>
                  <div className="home-activity-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{activity.tag}</strong>
                  </div>
                  <div className="home-activity-content">
                    <h3>{t(`home.activities.items.${activity.key}.title`)}</h3>
                    <p>
                      {t(`home.activities.items.${activity.key}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-faq" id="faq" aria-labelledby="faq-title">
          <header className="home-section-header">
            <h2 id="faq-title">{t("home.faq.title")}</h2>
          </header>

          <div className="home-faq-list">
            {FAQ_KEYS.map((key, index) => (
              <article key={key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="home-faq-content">
                  <h3>{t(`home.faq.items.${key}.question`)}</h3>
                  <p>{t(`home.faq.items.${key}.answer`)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-partners" aria-labelledby="partners-title">
          <header>
            <h2 id="partners-title">{t("home.partners.title")}</h2>
          </header>
          <nav aria-label={t("home.partners.linksLabel")}>
            {PARTNERS.map((partner) => (
              <a
                href={partner.href}
                key={partner.key}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{t(`home.partners.items.${partner.key}`)}</strong>
                <ExternalMark />
              </a>
            ))}
          </nav>
        </section>

        <section className="home-join" id="join" aria-labelledby="join-title">
          <h2 id="join-title">
            {isMember ? (
              <>
                {t("home.join.memberTitleLine1")}
                <br />
                {t("home.join.memberTitleLine2")}
                <span className="home-join-period">.</span>
              </>
            ) : (
              <>
                {t("home.join.guestTitleLine1")}
                <br />
                {t("home.join.guestTitleLine2")}
                <span className="home-join-period">.</span>
              </>
            )}
          </h2>
          <div>
            <nav aria-label={t("home.actions.joinAndLoginLinks")}>
              {isMember ? (
                memberActions.length > 0 ? (
                  memberActions.map((action) => (
                    <a href={action.href} key={action.href}>
                      {action.label} <ExternalMark />
                    </a>
                  ))
                ) : (
                  <Link
                    to="#activity"
                    onClick={(event) => scrollToHomeSection(event, "activity")}
                  >
                    {t("home.actions.clubActivities")}{" "}
                    <ArrowDown aria-hidden="true" />
                  </Link>
                )
              ) : (
                <>
                  <a href={joinHref}>
                    {t("home.actions.join")} <ExternalMark />
                  </a>
                  {isGuest ? (
                    <Link
                      to="#faq"
                      onClick={(event) => scrollToHomeSection(event, "faq")}
                    >
                      {t("home.actions.joinInfo")}{" "}
                      <ArrowDown aria-hidden="true" />
                    </Link>
                  ) : (
                    <a href={googleLoginUrl}>
                      {t("home.actions.login")} <ExternalMark />
                    </a>
                  )}
                </>
              )}
            </nav>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
