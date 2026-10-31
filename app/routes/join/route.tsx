import { t } from "@app/i18n/store";
import { pageTitle } from "@app/lib/title";
import JoinApp from "@join/App";
import "@app/features/home/home-page.css";
import "@join/index.css";

export function meta() {
  return [{ title: pageTitle(t("join.metaTitle")) }];
}

export default function JoinRoute() {
  return (
    <div className="home-page join-page-shell">
      <div className="join-page-body">
        <JoinApp />
      </div>
    </div>
  );
}
