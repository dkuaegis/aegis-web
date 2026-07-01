import { lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import LoginPage from "./pages/LoginPage";

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
  const { isAuthenticated, isLoading, isPending } = useAuth();
  const navigate = useNavigate();
  const shouldTrackPageView = !isLoading;
  const authState = !isPending && isAuthenticated ? "LOGGED_IN" : "LOGGED_OUT";
  useGoogleAnalytics(shouldTrackPageView, authState);

  // 로딩 중에는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="study flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // PENDING 상태이거나 인증되지 않은 경우 로그인 페이지 표시
  if (isPending || !isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="study min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="study flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-gray-500">로딩 중...</div>
          </div>
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
