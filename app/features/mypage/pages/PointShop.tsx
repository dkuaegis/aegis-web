import { lazy, useEffect, useState } from "react";
import { getMyPage } from "../api/Mypage";
import Button from "../components/Button";
import GachaList from "../components/GachaList";
import Header from "../components/Header";
import type { GachaItem } from "../model/Gacha";

const GachaMachine3D = lazy(() => import("../components/GachaMachine3D"));
import "../style/PointShop.css";

const items: GachaItem[] = [
  { id: "prize1", label: "치킨", color: "#FDF385" },
  { id: "prize2", label: "스타벅스 1만원권 상품권", color: "#CEF286" },
  { id: "prize3", label: "회비 할인 쿠폰", color: "#C2B5FB" },
  { id: "prize4", label: "컴포즈커피 아메리카노", color: "#FF5975" },
  { id: "prize5", label: "핫식스", color: "#74B8FF" },
];

const PointShop: React.FC = () => {
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
      <Header leftChild={"<"} title={"포인트샵"} />
      <div className="pointshop-page">
        <p className="gacha-desc">꽝없는 뽑기!</p>
        <h1 className="gacha-title">
          {userName}님, 100포인트를
          <br />
          뽑기 1회권으로 교환할 수 있어요!
        </h1>
        {!showGacha ? (
          <>
            <GachaList />
            <p className="gacha-list-desc">
              뽑기에서 나온 상품들 중<br />
              핫식스는 동아리방(우리은행 건물 혜당관 530호)에서,
              <br />
              커피 쿠폰, 치킨 등은 기프티콘으로 교환해드려요
            </p>
            <Button
              text={"교환하기"}
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
