// Google Analytics 타입 정의
type GtagCommand = "config" | "set" | "event" | "js";

interface GtagConfigParams {
  [key: string]: string | number | boolean | undefined;
}

type DataLayerArgs =
  | [GtagCommand, Date]
  | [GtagCommand, string, GtagConfigParams?]
  | [string, Record<string, unknown>];

// TypeScript를 위한 Window 인터페이스 확장
declare global {
  interface Window {
    dataLayer: DataLayerArgs[];
    gtag?: (...args: DataLayerArgs) => void;
  }
}

// Google Analytics 초기화
export const initGoogleAnalytics = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  if (!GA_MEASUREMENT_ID) {
    console.warn("Google Analytics ID가 설정되지 않았습니다.");
    return;
  }

  // gtag.js 스크립트 추가
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // dataLayer 및 gtag 함수 초기화
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: DataLayerArgs) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
};
