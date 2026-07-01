import { useEffect, useState } from "react";
import { getPointSummary } from "../api/Points";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import PointSummary from "../components/PointSummary";
import TabSelector from "../components/TabSelector";
import type { PointSummaryView } from "../model/Points";

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
};

const Points: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [summary, setSummary] = useState<PointSummaryView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 포인트 api 호출
  useEffect(() => {
    (async () => {
      try {
        const data = await getPointSummary();
        setSummary(data);
      } catch (e) {
        console.error("포인트 조회 실패:", e);
        setSummary({ balance: 0, history: [] });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) {
    return (
      <div>
        <Header leftChild="<" title="포인트" />
      </div>
    );
  }

  const balance = summary?.balance ?? 0;
  const transactions = summary?.history ?? [];

  // 포인트 적립/사용 정렬
  const filteredData = transactions.filter((t) => {
    if (selectedTab === 1) return t.sign === "+"; // 적립
    if (selectedTab === 2) return t.sign === "-"; // 사용
    return true; // 전체
  });

  return (
    <div>
      <Header leftChild="<" title="포인트" />
      {transactions.length === 0 && balance === 0 ? (
        <EmptyState type="point" />
      ) : (
        <>
          <PointSummary point={balance} />
          <TabSelector
            tabs={["전체", "적립", "사용"]}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />

          <div className="points-history-list">
            {filteredData.map((item) => (
              <Card
                key={item.pointTransactionId}
                type="point"
                title={item.reason}
                date={formatDate(item.createdAt)}
                amount={item.signedAmount}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Points;
