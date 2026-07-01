import { useEffect } from "react";
import questionImage from "../assets/question.webp";
import Button from "../components/Button";
import { useExternalBrowser } from "../hooks/useExternalBrowser";
import "../style/BrowserRedirect.css";

const BrowserRedirectPage: React.FC = () => {
  const { browserName, openInDefaultBrowser } = useExternalBrowser();

  useEffect(() => {
    openInDefaultBrowser();
  }, [openInDefaultBrowser]);

  return (
    <div className="browser-redirect-container">
      <div className="browser-redirect-image">
        <img src={questionImage} alt="browser redirect" />
      </div>
      <h1 className="browser-redirect-title">
        잠깐!
        <br />
        {browserName} 브라우저에서
        <br />
        접속 중이에요
      </h1>
      <p className="browser-redirect-desc">
        원활한 회원가입을 위해 외부 브라우저를 사용해주세요
      </p>

      <div className="browser-redirect-steps">
        <div className="browser-redirect-step">
          <div className="step-number">01</div>
          <div className="step-content">
            <div className="step-title">더보기 버튼 터치</div>
            <div className="step-desc">
              브라우저의 <span className="step-icon">⋯</span> 또는{" "}
              <span className="step-icon">⋮</span> 버튼을 터치하세요
            </div>
          </div>
        </div>

        <div className="browser-redirect-step">
          <div className="step-number">02</div>
          <div className="step-content">
            <div className="step-title">다른 브라우저로 열기</div>
            <div className="step-desc">
              메뉴에서{" "}
              <span className="step-highlight">"다른 브라우저로 열기"</span>를
              선택하세요
            </div>
          </div>
        </div>
      </div>

      <div className="button-group-section">
        <Button
          text={"동아리 소개"}
          type={"SIGNUP"}
          onClick={() =>
            (window.location.href =
              "https://dkuaegis.notion.site/Aegis-62053a8ce0a94588a9f3a1922ffed745")
          }
        />
      </div>

      <p className="browser-redirect-footer">
        문제가 지속되면 동아리 운영진에게 문의해 주세요
      </p>
    </div>
  );
};

export default BrowserRedirectPage;
