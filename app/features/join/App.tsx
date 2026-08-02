import { Progress } from "@join/components/ui/progress";
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
import LoginPage from "./pages/LoginPage";
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
  const { currentStep, progress } = useFunnel();

  return (
    <div className="mx-auto mb-8 w-full max-w-md px-4 py-8 pb-28">
      <Title currentStep={currentStep} />
      <Progress value={progress} className="mt-4 mb-8 h-0.5 w-full" />

      <Outlet />
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
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
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
