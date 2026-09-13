import { HomeFooter } from "@app/features/home/HomeFooter";
import { HomeHeader } from "@app/features/home/HomeHeader";
import JoinApp from "@join/App";
import { Analytics } from "@join/service/analytics";
import { AuthStatus, useAuthStore } from "@join/stores/authStore";
import "@app/features/home/home-page.css";
import "@join/index.css";

Analytics.init();

export default function JoinRoute() {
  const authStatus = useAuthStore((state) => state.isAuthenticated);
  const status =
    authStatus === AuthStatus.COMPLETED
      ? "COMPLETED"
      : authStatus === AuthStatus.NOT_COMPLETED
        ? "PENDING"
        : null;

  return (
    <div className="home-page join-page-shell">
      <HomeHeader
        authUser={{ isAuthenticated: status !== null, status }}
        loading={authStatus === AuthStatus.LOADING}
      />
      <div className="join-page-body">
        <JoinApp />
      </div>
      <HomeFooter />
    </div>
  );
}
