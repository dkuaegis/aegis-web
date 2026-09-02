import { JOIN_STEP_KOREAN_MAP, JOIN_STEPS } from "@join/constants/joinSteps";
import Chat from "@join/pages/Chat/Chat";
import Payment from "@join/pages/Payment/Payment";
import PersonalInfo from "@join/pages/PersonalInfo/PersonalInfo";
import Survey from "@join/pages/Survey/Survey";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Authentication from "./components/auth/authentication";
import Title from "./components/ui/custom/title";
import useFunnel from "./hooks/useFunnel";
import Agreement from "./pages/Agreement/Agreement";
import JoinComplete from "./pages/JoinComplete/JoinComplete";
import { Analytics } from "./service/analytics";

const useAnalyticsSetup = () => {
  const location = useLocation();

  // 1. 앱이 맨 처음 로드될 때 새로고침 여부를 체크합니다.
  useEffect(() => {
    Analytics.checkAndTrackRefresh();
  }, []); // 의존성 배열이 비어있으므로 최초 1회만 실행됩니다.

  // 2. URL(location)이 변경될 때마다 페이지 뷰를 추적합니다.
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    Analytics.trackPageView(currentPath);
  }, [location]); // location 객체가 바뀔 때마다 실행됩니다.
};

// BrowserRouter 안에서 훅을 실행하기 위한 컴포넌트
const AnalyticsTracker = () => {
  useAnalyticsSetup();
  return null;
};

const FunnelLayout = () => {
  const { currentStep } = useFunnel();
  const currentIndex = JOIN_STEPS.indexOf(currentStep);

  return (
    <div className="join-page-shell">
      <main className="join-main">
        <div className="join-workspace">
          <Title currentStep={currentStep} />
          <nav className="join-progress" aria-label="가입 진행 단계">
            <ol className="join-stepper">
              {JOIN_STEPS.map((step, index) => (
                <li
                  key={step}
                  className={
                    index === currentIndex
                      ? "is-current"
                      : index < currentIndex
                        ? "is-complete"
                        : undefined
                  }
                >
                  <span>{index < currentIndex ? "✓" : index + 1}</span>
                  <strong>{JOIN_STEP_KOREAN_MAP[step]}</strong>
                </li>
              ))}
            </ol>
          </nav>
          <div className="join-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <>
      <AnalyticsTracker />
      <Authentication>
        <Toaster position="bottom-center" />

        <Routes>
          <Route path="complete" element={<JoinComplete />} />

          <Route element={<FunnelLayout />}>
            <Route path="agreement" element={<Agreement />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="survey" element={<Survey />} />
            <Route path="chat" element={<Chat />} />
            <Route path="payment" element={<Payment />} />
          </Route>
        </Routes>
      </Authentication>
    </>
  );
};

export default App;
