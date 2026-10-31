import JoinApp from "@join/App";
import "@app/features/home/home-page.css";
import "@join/index.css";

export default function JoinRoute() {
  return (
    <div className="home-page join-page-shell">
      <div className="join-page-body">
        <JoinApp />
      </div>
    </div>
  );
}
