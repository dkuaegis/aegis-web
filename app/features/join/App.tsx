import { useI18n } from "@app/i18n";
import { JOIN_STEPS, joinStepLabelKey } from "@join/constants/joinSteps";
import Chat from "@join/pages/Chat/Chat";
import Payment from "@join/pages/Payment/Payment";
import PersonalInfo from "@join/pages/PersonalInfo/PersonalInfo";
import Survey from "@join/pages/Survey/Survey";
import { Toaster } from "react-hot-toast";
import { Outlet, Route, Routes } from "react-router";
import Authentication from "./components/auth/authentication";
import Title from "./components/ui/custom/title";
import useFunnel from "./hooks/useFunnel";
import Agreement from "./pages/Agreement/Agreement";
import JoinComplete from "./pages/JoinComplete/JoinComplete";

const FunnelLayout = () => {
  const { t } = useI18n();
  const { currentStep } = useFunnel();
  const currentIndex = JOIN_STEPS.indexOf(currentStep);

  return (
    <div className="join-funnel">
      <main className="join-main">
        <div className="join-workspace">
          <Title currentStep={currentStep} />
          <nav
            className="join-progress"
            aria-label={t("join.steps.progressLabel")}
          >
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
                  <strong>{t(joinStepLabelKey(step))}</strong>
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
  );
};

export default App;
