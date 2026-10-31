import { useI18n } from "@app/i18n";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getCoupons } from "../api/Coupons";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import TabSelector from "../components/TabSelector";
import type { CouponCardProps } from "../model/Card";

const Coupons: React.FC = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [couponItems, setCouponItems] = useState<
    Array<{
      id: number;
      discountAmount: number;
      desc: string;
      status: CouponCardProps["status"];
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // 선택한 탭은 URL 쿼리 파라미터가 기준입니다.
  const filter = searchParams.get("filter");
  const selectedTab = filter === "unused" ? 1 : filter === "used" ? 2 : 0;

  // 쿠폰 API 호출
  useEffect(() => {
    (async () => {
      try {
        const data = await getCoupons(); // [{ issuedCouponId, couponName, discountAmount, isValid }, ...]
        const mapped = (data ?? []).map((c) => ({
          id: c.issuedCouponId,
          discountAmount: c.discountAmount,
          desc: c.couponName,
          status: (c.isValid ? "UNUSED" : "USED") as CouponCardProps["status"],
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
        <Header
          leftChild={t("mypage.nav.back")}
          title={t("mypage.coupons.title")}
        />
        <TabNavigation />
      </div>
    );
  }

  // 탭 필터: 0 전체, 1 사용전, 2 사용후
  const filteredData = couponItems.filter((item) => {
    if (selectedTab === 1) return item.status === "UNUSED";
    if (selectedTab === 2) return item.status === "USED";
    return true; // 전체
  });

  return (
    <div>
      <Header
        leftChild={t("mypage.nav.back")}
        title={t("mypage.coupons.title")}
      />
      <TabNavigation />
      {couponItems.length === 0 ? (
        <EmptyState type="coupon" />
      ) : (
        <>
          <TabSelector
            tabs={[
              t("mypage.coupons.tabs.all"),
              t("mypage.coupons.tabs.unused"),
              t("mypage.coupons.tabs.used"),
            ]}
            selected={selectedTab}
            onSelect={(tabIndex) => {
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
                price={t("mypage.coupons.priceFormat", {
                  amount: item.discountAmount.toLocaleString(),
                })}
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
