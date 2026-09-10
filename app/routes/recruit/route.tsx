import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { useMemo } from "react";
import creditCardIcon from "../../assets/icon/ic_creditCard.svg";
import emailIcon from "../../assets/icon/ic_email.svg";
import lockIcon from "../../assets/icon/ic_lock.svg";
import profileIcon from "../../assets/icon/ic_profile.svg";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

export function meta() {
  return [
    { title: translate("pages.recruit.meta.title") },
    {
      name: "description",
      content: translate("pages.recruit.meta.description"),
    },
  ];
}

function Recruit() {
  const { t } = useI18n();

  // 별들을 생성하는 함수
  const stars = useMemo(() => {
    const generateStars = (count: number, className: string) => {
      return Array.from({ length: count }, () => {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        };
        const key = `${className}-${style.left}-${style.top}-${style.animationDelay}-${style.animationDuration}`;
        return (
          <div
            key={key}
            className={`star ${className}`}
            style={style}
            aria-hidden="true"
          />
        );
      });
    };

    return (
      <>
        {generateStars(50, "star-sm")}
        {generateStars(30, "star-md")}
        {generateStars(15, "star-lg")}
      </>
    );
  }, []);

  return (
    <>
      <div className="recruit-page">
        {/* 별들 */}
        <div className="stars-container" aria-hidden="true">
          {stars}
        </div>

        {/* 유성 */}
        <div className="shooting-star shooting-star-1" aria-hidden="true"></div>
        <div className="shooting-star shooting-star-2" aria-hidden="true"></div>

        <Navigation currentPage="recruit" />

        <section className="recruit">
          <div className="recruit-inner">
            <div className="recruit-header">
              <h2 className="recruit-title">{t("pages.recruit.title")}</h2>
              <p className="recruit-subtitle">{t("pages.recruit.subtitle")}</p>
              <a
                href="/auth/continue?intent=join"
                target="_blank"
                rel="noopener noreferrer"
                className="recruit-cta-btn"
              >
                {t("pages.recruit.cta")}
              </a>
            </div>

            <div className="recruit-content">
              <div className="recruit-notice">
                <div className="notice-item">
                  <div className="notice-icon">
                    <img
                      src={profileIcon}
                      alt={t("pages.recruit.notice.targetIconAlt")}
                      width="32"
                      height="32"
                    />
                  </div>
                  <div>
                    <p>
                      <strong>{t("pages.recruit.notice.targetLabel")}</strong>
                      {t("pages.recruit.notice.targetValue")}
                    </p>
                    <p className="notice-sub">
                      {t("pages.recruit.notice.targetSub")}
                    </p>
                  </div>
                </div>

                <div className="notice-item">
                  <div className="notice-icon">
                    <img
                      src={emailIcon}
                      alt={t("pages.recruit.notice.emailIconAlt")}
                      width="32"
                      height="32"
                    />
                  </div>
                  <p>{t("pages.recruit.notice.emailBody")}</p>
                </div>

                <div className="notice-item">
                  <div className="notice-icon">
                    <img
                      src={lockIcon}
                      alt={t("pages.recruit.notice.securityIconAlt")}
                      width="32"
                      height="32"
                    />
                  </div>
                  <div>
                    <p>
                      {t("pages.recruit.notice.securityLead")}
                      <strong>
                        {t("pages.recruit.notice.securityStrong")}
                      </strong>
                      {t("pages.recruit.notice.securityTail")}
                    </p>
                    <p className="notice-sub">
                      {t("pages.recruit.notice.securitySub")}
                    </p>
                  </div>
                </div>

                <div className="notice-item">
                  <div className="notice-icon">
                    <img
                      src={creditCardIcon}
                      alt={t("pages.recruit.notice.feeIconAlt")}
                      width="32"
                      height="32"
                    />
                  </div>
                  <div>
                    <p>
                      {t("pages.recruit.notice.feeLead")}
                      <strong>{t("pages.recruit.notice.feeStrong")}</strong>
                      {t("pages.recruit.notice.feeTail")}
                    </p>
                    <p className="notice-sub">
                      {t("pages.recruit.notice.feeSub")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Recruit;
