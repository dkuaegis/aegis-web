import { useI18n } from "@app/i18n";
import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import StudyLayout, { StudyLoading } from "./components/ui/StudyLayout";
import useAuth from "./hooks/useAuth";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";

const StudyListPage = lazy(() => import("./pages/StudyListPage"));
const CreateStudyPage = lazy(() => import("./pages/CreateStudyPage"));
const ApplicationStatusWrapper = lazy(
  () => import("./pages/wrappers/ApplicationStatusWrapper")
);
const AttendanceWrapper = lazy(
  () => import("./pages/wrappers/AttendanceWrapper")
);
const EditStudyWrapper = lazy(
  () => import("./pages/wrappers/EditStudyWrapper")
);
const StudyDetailWrapper = lazy(
  () => import("./pages/wrappers/StudyDetailWrapper")
);
const StudyMembersWrapper = lazy(
  () => import("./pages/wrappers/StudyMemberWrapper")
);

const STUDY_BASE_PATH = "/study";

const App = () => {
  const { t } = useI18n();
  const { isAuthenticated, isLoading, isPending } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldTrackPageView = !isLoading;
  const authState = !isPending && isAuthenticated ? "LOGGED_IN" : "LOGGED_OUT";
  useGoogleAnalytics(shouldTrackPageView, authState);

  // 로딩 중에는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="study">
        <StudyLayout>
          <StudyLoading label={t("study.loading.general")} />
        </StudyLayout>
      </div>
    );
  }

  if (isPending) {
    return <Navigate to="/join" replace />;
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const searchParams = new URLSearchParams({ intent: "study", returnTo });
    return (
      <Navigate to={`/auth/continue?${searchParams.toString()}`} replace />
    );
  }

  return (
    <div className="study min-h-screen bg-white">
      <Suspense
        fallback={
          <StudyLayout>
            <StudyLoading label={t("study.loading.general")} />
          </StudyLayout>
        }
      >
        <Routes>
          <Route
            index
            element={
              <StudyListPage
                onCreateStudy={() => navigate(`${STUDY_BASE_PATH}/create`)}
                onViewStudyDetail={(studyId: number) =>
                  navigate(`${STUDY_BASE_PATH}/detail/${studyId}`)
                }
              />
            }
          />
          <Route path="create" element={<CreateStudyPage />} />
          <Route path="detail/:studyId" element={<StudyDetailWrapper />} />
          <Route path="edit/:studyId" element={<EditStudyWrapper />} />
          <Route
            path="applications/:studyId"
            element={<ApplicationStatusWrapper />}
          />
          <Route path="members/:studyId" element={<StudyMembersWrapper />} />
          <Route path="attendance/:studyId" element={<AttendanceWrapper />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
