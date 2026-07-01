import mixpanel from "mixpanel-browser";
import ReactGA from "react-ga4";

interface MixpanelUserProfile {
  $name?: string;
  $email?: string;
  [key: string]: string | number | boolean | undefined | null;
}

interface EventProperties {
  category?: string;
  [key: string]: string | number | boolean | undefined | null;
}

let isInitialized = false;

const isValidEnvVar = (value: string | undefined): value is string => {
  return !!value && !["false", "null", "undefined"].includes(value);
};

const isDev = import.meta.env.MODE === "development";

const init = (): void => {
  if (isInitialized) {
    if (isDev) {
      console.warn("Analytics has already been initialized.");
    }
    return;
  }

  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const mixpanelToken = import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN;

  try {
    if (isValidEnvVar(gaMeasurementId)) {
      ReactGA.initialize(gaMeasurementId);
      if (isDev) console.log("GA initialized.");
    }

    if (isValidEnvVar(mixpanelToken)) {
      mixpanel.init(mixpanelToken, {
        debug: isDev,
      });
      if (isDev) console.log("Mixpanel initialized.");
    }
    isInitialized = true;
  } catch (error) {
    if (isDev) {
      console.error("Failed to initialize analytics:", error);
    }
  }
};

const identifyUser = (userId: string, userData: MixpanelUserProfile): void => {
  try {
    if (isValidEnvVar(import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN)) {
      mixpanel.identify(userId);
      mixpanel.people.set(userData);
    }
    if (isValidEnvVar(import.meta.env.VITE_GA_MEASUREMENT_ID)) {
      ReactGA.set({ userId });
    }
  } catch (error) {
    if (isDev) {
      console.error("Failed to identify user:", error);
    }
  }
};

// 학번/이름 기반 식별 헬퍼
const identifyStudent = (studentId: string, name?: string): void => {
  const profile: MixpanelUserProfile = {
    $name: name,
    student_id: studentId,
  };
  identifyUser(studentId, profile);
};

const trackEvent = (
  eventName: string,
  properties: EventProperties = {}
): void => {
  try {
    if (isValidEnvVar(import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN)) {
      mixpanel.track(eventName, properties);
    }
    if (isValidEnvVar(import.meta.env.VITE_GA_MEASUREMENT_ID)) {
      ReactGA.event(eventName, properties);
    }
  } catch (error) {
    if (isDev) {
      console.error(`Failed to track event [${eventName}]:`, error);
    }
  }
};

const trackPageView = (path: string): void => {
  try {
    if (isValidEnvVar(import.meta.env.VITE_GA_MEASUREMENT_ID)) {
      ReactGA.send({ hitType: "pageview", page: path });
    }
    if (isValidEnvVar(import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN)) {
      mixpanel.track("Page View", { page_path: path });
    }
  } catch (error) {
    if (isDev) {
      console.error(`Failed to track page view [${path}]:`, error);
    }
  }
};

const checkAndTrackRefresh = (): void => {
  try {
    if (window.performance) {
      const navigationEntries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (
        navigationEntries.length > 0 &&
        navigationEntries[0].type === "reload"
      ) {
        safeTrack("Page Refreshed", {
          category: "Navigation",
          page_path: window.location.pathname + window.location.search,
        });
      }
    }
  } catch (error) {
    if (isDev) {
      console.error("Failed to check and track refresh:", error);
    }
  }
};

/**
 * 어떤 종류의 에러든 일관된 문자열로 변환하고 길이를 제한합니다.
 * PII/민감정보 유출 방지 및 분석 플랫폼의 길이 제한을 준수하는 데 도움이 됩니다.
 * @param err - 알 수 없는 타입의 에러 객체
 * @returns 정규화된 에러 메시지 문자열
 */
const toErrorMessage = (err: unknown): string => {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return msg.slice(0, 200); // 메시지 길이를 200자로 제한
};

/**
 * safeTrack를 안전하게 호출하는 래퍼 함수.
 * 이 함수는 절대 에러를 발생시키지 않으므로, 결제와 같은 중요 로직의 흐름을 방해하지 않습니다.
 * @param eventName - 이벤트 이름
 * @param properties - 이벤트 속성
 */
const safeTrack = (eventName: string, properties?: EventProperties): void => {
  try {
    // safeTrack 함수를 호출합니다.
    trackEvent(eventName, properties);
  } catch (err) {
    // 개발 환경에서만 내부 에러를 조용히 로깅하여 디버깅을 돕습니다.
    if (isDev) {
      console.error(
        `safeTrack failed internally for event [${eventName}]:`,
        err
      );
    }
    // 의도적으로 에러를 무시합니다 (no-op).
  }
};

export const Analytics = {
  init,
  identifyUser,
  identifyStudent,
  toErrorMessage,
  trackEvent,
  trackPageView,
  checkAndTrackRefresh,
  safeTrack,
};
