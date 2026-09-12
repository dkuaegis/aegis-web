import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

export function meta() {
  return [
    { title: translate("pages.faq.meta.title") },
    { name: "description", content: translate("pages.faq.meta.description") },
  ];
}

const FAQ_KEYS = [
  "about",
  "eligibility",
  "skill",
  "activities",
  "fee",
  "room",
  "more",
] as const;

function FAQ() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);


  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      <div className="faq-page">
        {/* 별들 */}
        <div className="stars-container" aria-hidden="true">
          {stars}
        </div>

        {/* 유성 */}
        <div className="shooting-star shooting-star-1" aria-hidden="true"></div>
        <div className="shooting-star shooting-star-2" aria-hidden="true"></div>

        <Navigation currentPage="faq" />

        <section className="faq">
          <div className="faq-inner">
            <div className="faq-header">
              <h2 className="faq-title">{t("pages.faq.title")}</h2>
              <p className="faq-subtitle">{t("pages.faq.subtitle")}</p>
            </div>
            <div className="faq-list">
              {FAQ_KEYS.map((key, index) => (
                <div
                  key={key}
                  className={`faq-item ${openFaq === index ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{t(`pages.faq.items.${key}.question`)}</span>
                    <svg
                      aria-hidden="true"
                      className="faq-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="faq-answer">
                    <p>{t(`pages.faq.items.${key}.answer`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default FAQ;
