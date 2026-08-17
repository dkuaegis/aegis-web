import { ArrowDown, ArrowUpRight } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { type AuthUser, checkAuth } from "../api/auth";
import { HomeFooter } from "../features/home/HomeFooter";
import { HomeHeader } from "../features/home/HomeHeader";
import { createApiUrl } from "../lib/apiBaseUrl";

import "../features/home/home-page.css";

export function meta() {
  return [
    { title: "Aegis - 단국대학교 개발·보안 동아리" },
    {
      name: "description",
      content:
        "성장을 원하는 모두에게 열려있는 단국대학교 최고의 개발·보안 중앙동아리",
    },
  ];
}

const partners = [
  {
    name: "단국대학교 SW중심대학사업단",
    href: "https://swcu.dankook.ac.kr/home",
  },
  {
    name: "단국대학교 총동아리연합회",
    href: "https://www.instagram.com/dku_weave",
  },
  { name: "HSPACE", href: "https://hspace.io" },
  { name: "theori", href: "https://theori.io/ko" },
];

const activities = [
  {
    title: "스터디",
    description:
      "교내 동아리 중 가장 다양하고 수준 높은 스터디를 통해 기초부터 심화까지 함께 공부하며 성장해요.",
    tag: "Learn",
  },
  {
    title: "개발팀",
    description:
      "동아리 내에서 겪는 실제 문제를 해결하며, 개발·배포·운영·개선 프로세스를 경험할 수 있어요.",
    tag: "Build",
  },
  {
    title: "코드클럽",
    description:
      "중학생 대상 코딩 교육 봉사로 지식을 나누고, 가르치는 경험과 봉사시간을 함께 얻어가요.",
    tag: "Share",
  },
  {
    title: "세미나",
    description:
      "졸업한 선배들의 다양한 현장 경험을 듣고, 대학 생활과 취업에 필요한 정보를 배워요.",
    tag: "Listen",
  },
  {
    title: "보안팀",
    description:
      "CTF와 내부 세미나로 보안 역량을 쌓고, 개발팀 제품을 검토해 더 안전한 제품을 만드는 데 기여해요.",
    tag: "Secure",
  },
  {
    title: "테크톡",
    description:
      "관심 있게 공부한 내용을 발표로 나누며, 서로의 관점과 경험을 넓혀요.",
    tag: "Speak",
  },
];

const faqItems = [
  {
    question: "모집 대상은 어떻게 되나요?",
    answer:
      "단국대학교 신입생, 재학생, 휴학생 모두 지원할 수 있습니다. 학년과 전공에 관계없이 개발과 보안에 관심이 있다면 누구나 환영합니다.",
  },
  {
    question: "개발이나 보안을 처음 접해도 지원할 수 있나요?",
    answer:
      "네. 개발이나 보안을 처음 접하더라도 괜찮습니다. 배우고자 하는 의지와 관심이 있다면 누구나 지원할 수 있습니다.",
  },
  {
    question: "어떤 활동을 하나요?",
    answer:
      "정기 스터디, 프로젝트 개발, CTF 대회 참가, 보안 세미나, 해커톤과 선후배 멘토링 등을 진행합니다.",
  },
  {
    question: "동아리 회비가 있나요?",
    answer: "회비는 15,000원이며 동아리 운영과 활동에 사용됩니다.",
  },
  {
    question: "동아리방은 어디인가요?",
    answer: "혜당관 530호(우리은행 건물)에 있습니다.",
  },
  {
    question: "더 궁금한 사항이 있어요.",
    answer:
      "dankook.aegis@gmail.com 또는 Instagram @dku_aegis로 문의해 주세요.",
  },
];

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
  const joinHref = "/join";
  const memberActions = [
    { label: "스터디 둘러보기", href: "/study" },
    { label: "내 활동 보기", href: "/mypage" },
  ];
  const primaryAction = isMember
    ? (memberActions[0] ?? {
        label: "동아리 활동 보기",
        href: "#activities",
      })
    : { label: "가입하기", href: joinHref };
  const secondaryAction = isMember
    ? (memberActions[1] ?? { label: "가입 정보 보기", href: "#faq" })
    : { label: "가입 정보 보기", href: "#faq" };
  return (
    <div className="home-page" id="top">
      <Link
        className="home-skip-link"
        to="#main-content"
        onClick={(event) => scrollToHomeSection(event, "main-content")}
      >
        본문으로 바로가기
      </Link>

      <HomeHeader authUser={authUser} loading={authLoading} />

      <main id="main-content">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-hero-main">
            <h1 id="hero-title">
              성장을 원하는
              <br />
              모두에게 <em>열려 있는,</em>
              <br />
              개발 · 보안 중앙동아리<span className="home-hero-period">.</span>
            </h1>

            <GrowthOrb />

            <div className="home-hero-summary">
              <p>
                학년과 전공에 관계없이 <strong>신입생 · 재학생 · 휴학생</strong>
                {` `}모두 지원할 수 있습니다.
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
                  배우고,
                </span>{" "}
                <span className="home-activities-heading-word is-making">
                  만들고,
                </span>
                <br />
                <span className="home-activities-heading-word is-sharing">
                  나누는
                </span>{" "}
                활동
              </h2>
            </div>
          </header>

          <div className="home-activity-story">
            <ol className="home-activity-steps">
              {activities.map((activity, index) => (
                <li key={activity.title}>
                  <div className="home-activity-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{activity.tag}</strong>
                  </div>
                  <div className="home-activity-content">
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-faq" id="faq" aria-labelledby="faq-title">
          <header className="home-section-header">
            <h2 id="faq-title">자주 묻는 질문</h2>
          </header>

          <div className="home-faq-list">
            {faqItems.map((item, index) => (
              <article key={item.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="home-faq-content">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-partners" aria-labelledby="partners-title">
          <header>
            <h2 id="partners-title">함께하는 파트너</h2>
          </header>
          <nav aria-label="파트너 링크">
            {partners.map((partner) => (
              <a
                href={partner.href}
                key={partner.name}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{partner.name}</strong>
                <ExternalMark />
              </a>
            ))}
          </nav>
        </section>

        <section className="home-join" id="join" aria-labelledby="join-title">
          <h2 id="join-title">
            {isMember ? (
              <>
                계속 배우고, 만들고,
                <br />
                함께 나눠요<span className="home-join-period">.</span>
              </>
            ) : (
              <>
                성장을 원하는 모두에게
                <br />
                열려 있습니다<span className="home-join-period">.</span>
              </>
            )}
          </h2>
          <div>
            <nav aria-label="가입 및 로그인 링크">
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
                    동아리 활동 보기 <ArrowDown aria-hidden="true" />
                  </Link>
                )
              ) : (
                <>
                  <a href={joinHref}>
                    가입하기 <ExternalMark />
                  </a>
                  {isGuest ? (
                    <Link
                      to="#faq"
                      onClick={(event) => scrollToHomeSection(event, "faq")}
                    >
                      가입 정보 보기 <ArrowDown aria-hidden="true" />
                    </Link>
                  ) : (
                    <a href={createApiUrl("oauth2/authorization/google")}>
                      로그인 <ExternalMark />
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
