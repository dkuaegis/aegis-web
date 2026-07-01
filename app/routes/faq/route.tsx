import { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

export function meta() {
  return [
    { title: "FAQ - Aegis" },
    { name: "description", content: "Aegis 자주 묻는 질문" },
  ];
}

function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "Aegis는 어떤 동아리인가요?",
      answer:
        "Aegis는 성장을 원하는 모두에게 열려있는 단국대학교 최고의 개발 · 보안 중앙동아리입니다.",
    },
    {
      question: "모집 대상이 어떻게 되나요?",
      answer:
        "단국대학교 신입생, 재학생, 휴학생 모두 지원 가능합니다. 학년과 전공에 관계없이 보안과 개발에 관심이 있다면 누구나 환영합니다!",
    },
    {
      question: "실력이 뛰어난 사람만 지원할 수 있나요?",
      answer:
        "아닙니다! 열정과 배우고자 하는 의지가 있다면 누구나 지원할 수 있습니다. 함께 성장하는 것이 저희 동아리의 목표입니다.",
    },
    {
      question: "동아리 활동은 어떤게 있나요?",
      answer:
        "정기적인 스터디, 프로젝트 개발, CTF 대회 참가, 보안 세미나, 해커톤 등 다양한 활동을 진행하고 있습니다. 또한 선후배 간 멘토링을 통해 함께 성장하고 있습니다.",
    },
    {
      question: "동아리 회비가 있나요?",
      answer:
        "네, 회비는 15,000원입니다. 회비는 동아리 운영 및 활동에 사용됩니다. 이전 운영진은 회비가 면제되니 문의해주세요.",
    },
    {
      question: "동아리방 위치는 어디인가요?",
      answer: "혜당관 530호 (우리은행 건물)입니다!",
    },
    {
      question: "더 궁금한 사항이 있어요",
      answer:
        "언제든지 dankook.aegis@gmail.com 또는 인스타그램 @dku_aegis로 문의해주세요. 친절하게 답변드리겠습니다!",
    },
  ];

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
              <h2 className="faq-title">자주 묻는 질문</h2>
              <p className="faq-subtitle">
                가입하기 전 궁금한 내용을 먼저 확인해보세요.
              </p>
            </div>
            <div className="faq-list">
              {faqData.map((item, index) => (
                <div
                  key={item.question}
                  className={`faq-item ${openFaq === index ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
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
                    <p>{item.answer}</p>
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
