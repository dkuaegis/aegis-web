import { useI18n } from "@app/i18n";
import { lazy, useEffect, useState } from "react";
import { getMyPage } from "../api/Mypage";
import Button from "../components/Button";
import GachaList from "../components/GachaList";
import Header from "../components/Header";
import type { GachaItem } from "../model/Gacha";

const GachaMachine3D = lazy(() => import("../components/GachaMachine3D"));
import "../style/PointShop.css";

/** `label` holds the API prize code; the displayed name comes from the
 *  dictionary at render time. */
const items: GachaItem[] = [
  { id: "prize1", label: "CHICKEN", color: "#FDF385" },
  { id: "prize2", label: "COFFEE_HIGH", color: "#CEF286" },
  { id: "prize3", label: "CLUB_DUES_DISCOUNT_COUPON", color: "#C2B5FB" },
  { id: "prize4", label: "COFFEE_LOW", color: "#FF5975" },
  { id: "prize5", label: "ENERGY_DRINK", color: "#74B8FF" },
];

const PointShop: React.FC = () => {
  const { t, tList } = useI18n();
  const [showGacha, setShowGacha] = useState(false);
  const [userName, setUserName] = useState("");

  // 사용자 이름 가져오기
  useEffect(() => {
    (async () => {
      try {
        const myPageData = await getMyPage();
        setUserName(myPageData.name);
      } catch (error) {
        console.error("마이페이지 정보 조회 실패:", error);
      }
    })();
  }, []);

  return (
    <>
      <Header
        leftChild={t("mypage.nav.back")}
        title={t("mypage.pointShop.title")}
      />
      <div className="pointshop-page">
        <p className="gacha-desc">{t("mypage.pointShop.teaser")}</p>
        <h1 className="gacha-title">
          {t("mypage.pointShop.heading", { name: userName })
            .split("\n")
            .map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
        </h1>
        {!showGacha ? (
          <>
            <GachaList />
            <p className="gacha-list-desc">
              {tList("mypage.pointShop.listDescription").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <Button
              text={t("mypage.pointShop.exchange")}
              type={"EXCHANGE"}
              onClick={() => setShowGacha(true)}
            />
          </>
        ) : (
          <div className="gacha-container">
            <GachaMachine3D
              items={items}
              onResult={(it: GachaItem) => console.log("결과:", it.label)}
              width={320}
              height={385}
              modelScale={0.7}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PointShop;
