import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCoupons } from "../api/Coupons";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import TabSelector from "../components/TabSelector";
import type { CouponCardProps } from "../model/Card";

const formatPrice = (amount: number): string => `${amount.toLocaleString()}원`;

const Coupons: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [couponItems, setCouponItems] = useState<
    Array<{
      id: number;
      price: string;
      desc: string;
      status: CouponCardProps["status"];
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL 쿼리 파라미터에 따른 초기 탭 설정
  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter === "unused") {
      setSelectedTab(1);
    } else if (filter === "used") {
      setSelectedTab(2);
    } else {
      setSelectedTab(0);
    }
  }, [searchParams]);

  // 쿠폰 API 호출
  useEffect(() => {
    (async () => {
      try {
        const data = await getCoupons(); // [{ issuedCouponId, couponName, discountAmount, isValid }, ...]
        const mapped = (data ?? []).map((c) => ({
          id: c.issuedCouponId,
          price: formatPrice(c.discountAmount),
          desc: c.couponName,
          status: (c.isValid
            ? "사용전"
            : "사용완료") as CouponCardProps["status"],
        }));
        setCouponItems(mapped);
      } catch (e) {
        console.error("쿠폰 조회 실패:", e);
        setCouponItems([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) {
    return (
      <div>
        <Header leftChild={"<"} title={"선물함"} />
        <TabNavigation />
      </div>
    );
  }

  // 탭 필터: 0 전체, 1 사용전, 2 사용후
  const filteredData = couponItems.filter((item) => {
    if (selectedTab === 1) return item.status === "사용전";
    if (selectedTab === 2) return item.status === "사용완료";
    return true; // 전체
  });

  return (
    <div>
      <Header leftChild={"<"} title={"선물함"} />
      <TabNavigation />
      {couponItems.length === 0 ? (
        <EmptyState type="coupon" />
      ) : (
        <>
          <TabSelector
            tabs={["전체", "사용전", "사용완료"]}
            selected={selectedTab}
            onSelect={(tabIndex) => {
              setSelectedTab(tabIndex);
              if (tabIndex === 1) {
                setSearchParams({ filter: "unused" });
              } else if (tabIndex === 2) {
                setSearchParams({ filter: "used" });
              } else {
                setSearchParams({});
              }
            }}
          />
          <div className="coupons-history-list">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                type="coupon"
                price={item.price}
                desc={item.desc}
                status={item.status}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Coupons;
