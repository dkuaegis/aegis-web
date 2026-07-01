import { useEffect, useState } from "react";
import { getMyDrawHistory } from "../api/PointDrawMe";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import type { HistoryCardProps } from "../model/Card";
import type { DrawHistoryItem } from "../model/DrawMe";

export default function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryCardProps[]>([]);

  // 뽑기 이력 조회
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyDrawHistory();
        const convertedData: HistoryCardProps[] = data.map(
          (item: DrawHistoryItem) => ({
            type: "history",
            title: item.item,
            date: new Date(item.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          })
        );
        setHistoryData(convertedData);
      } catch (error) {
        console.error("뽑기 이력 조회 실패:", error);
        setHistoryData([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div>
        <Header leftChild={"<"} title={"선물함"} />
        <TabNavigation defaultTab="history" />
      </div>
    );
  }

  return (
    <div>
      <Header leftChild={"<"} title={"선물함"} />
      <TabNavigation defaultTab="history" />
      {historyData.length === 0 ? (
        <EmptyState type="history" />
      ) : (
        <div style={{ padding: "18px" }}>
          {historyData.map((item) => (
            <Card key={`${item.title}-${item.date}`} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
