import { useEffect } from "react";
import MypageApp from "@mypage/App";
import { initGoogleAnalytics } from "@mypage/utils/analytics";
import "@mypage/index.css";

initGoogleAnalytics();

export default function MypageRoute() {
  useEffect(() => {
    document.body.classList.add("mypage-body");
    return () => {
      document.body.classList.remove("mypage-body");
    };
  }, []);

  return (
    <div className="mypage" id="root">
      <MypageApp />
    </div>
  );
}
