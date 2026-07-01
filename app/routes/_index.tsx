import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

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

import codeClubImg from "../assets/image/code-club.webp";
import devTeamImg from "../assets/image/dev-team.webp";
import psHspaceImg from "../assets/image/ps_hspace.webp";
import psSwImg from "../assets/image/ps_sw.webp";
import psTheoriImg from "../assets/image/ps_theori.webp";
import securityTeamImg from "../assets/image/security-team.webp";
import seminarImg from "../assets/image/seminar.webp";
// 이미지 import
import studyImg from "../assets/image/study.webp";
import techTalkImg from "../assets/image/tech-talk.webp";

function App() {
  const partners = [
    {
      href: "https://hspace.io/login",
      src: psHspaceImg,
      alt: "H-Space",
    },
    {
      href: "https://swcu.dankook.ac.kr/home",
      src: psSwImg,
      alt: "SW중심대학",
    },
    {
      href: "https://theori.io/ko/",
      src: psTheoriImg,
      alt: "Theori",
    },
  ];

  // 별들을 생성하는 함수
  const generateStars = (count: number, className: string) => {
    return Array.from({ length: count }, (_, i) => {
      // 고유한 key 생성 (className + index + random value로 충분히 고유함)
      const uniqueKey = `${className}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      };
      return (
        <div
          key={uniqueKey}
          className={`star ${className}`}
          style={style}
          aria-hidden="true"
        />
      );
    });
  };

  return (
    <>
      <main className="hero">
        {/* 별들 */}
        <div className="stars-container" aria-hidden="true">
          {generateStars(50, "star-sm")}
          {generateStars(30, "star-md")}
          {generateStars(15, "star-lg")}
        </div>

        {/* 유성 */}
        <div className="shooting-star shooting-star-1" aria-hidden="true"></div>
        <div className="shooting-star shooting-star-2" aria-hidden="true"></div>

        <div className="hero-frame" aria-hidden="true"></div>
        <div className="panel-left" aria-hidden="true"></div>
        <div className="signal" aria-hidden="true"></div>
        <div className="spark s1" aria-hidden="true"></div>
        <div className="spark s2" aria-hidden="true"></div>
        <div className="spark s3" aria-hidden="true"></div>

        <Navigation currentPage="home" />

        <section className="hero-main">
          <div className="club-tag">단국대학교 개발·보안 동아리</div>
          <h1 className="hero-title">AEGIS</h1>
          <p className="hero-sub">
            성장을 원하는 모두에게 열려있는 단국대학교 최고의 개발 · 보안
            중앙동아리
          </p>
          <div className="value-grid">
            <div className="value">Web Development</div>
            <div className="value">Game Development</div>
            <div className="value">Security Engineering</div>
            <div className="value">Red &amp; Blue Team</div>
          </div>
        </section>

        <footer className="hero-footer">
          <div className="line"></div>
          <span>AEGIS 2026</span>
        </footer>
      </main>

      <section className="activity" id="activity">
        <div className="activity-inner">
          <div>
            <div className="activity-title">Activity</div>
          </div>
          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-card-img">
                <img src={studyImg} alt="스터디" />
              </div>
              <div className="activity-card-content">
                <h3>스터디</h3>
                <p>
                  교내 동아리중 가장 다양하고 수준 높은 스터디를 통해 기초부터
                  심화까지 함께 공부하며 성장해요
                </p>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-img">
                <img src={codeClubImg} alt="코드클럽" />
              </div>
              <div className="activity-card-content">
                <h3>코드클럽</h3>
                <p>
                  중학생들을 대상으로 코딩 교육 봉사를 진행하며, 가르치는 능력과
                  봉사시간을 함께 얻어가요
                </p>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-img">
                <img src={devTeamImg} alt="개발팀" />
              </div>
              <div className="activity-card-content">
                <h3>개발팀</h3>
                <p>
                  동아리 내에서 겪는 '실제 문제'를 해결하며, 개발 - 배포 - 운영
                  - 개선 프로세스를 경험할 수 있어요
                </p>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-img">
                <img src={securityTeamImg} alt="보안팀" />
              </div>
              <div className="activity-card-content">
                <h3>보안팀</h3>
                <p>
                  정기적으로 CTF에 참여하고 내부 세미나로 성과를 공유하며,
                  개발팀 제품에 대한 보안 검사를 수행해요
                </p>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-img">
                <img src={seminarImg} alt="세미나" />
              </div>
              <div className="activity-card-content">
                <h3>세미나</h3>
                <p>
                  졸업하여 현장에서 다양한 경험을 쌓으신 선배님들과 교류하며
                  대학 생활과 취업에 관한 꿀팁을 배워봐요
                </p>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-img">
                <img src={techTalkImg} alt="테크톡" />
              </div>
              <div className="activity-card-content">
                <h3>테크톡</h3>
                <p>
                  평소 관심있었던 내용을 공유하며 복습하고, 발표 경험도
                  쌓아보아요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partners">
        <div className="partners-inner">
          <div className="partners-title">Partnerships</div>
          <div className="partners-grid">
            {partners.map((partner) => (
              <a
                key={partner.href}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card"
              >
                <img src={partner.src} alt={partner.alt} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* 고정된 가입하기 버튼 */}
      <a
        href="/join/login"
        className="fixed-join-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>가입하기</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </>
  );
}

export default App;
