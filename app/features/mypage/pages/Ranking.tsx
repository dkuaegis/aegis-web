import { useEffect, useState } from "react";
import { getRankingData } from "../api/Ranking";
import Header from "../components/Header";
import MyRankCard from "../components/MyRankCard";
import RankingInfo from "../components/RankingInfo";
import RankingList from "../components/RankingList";
import type {
  MyRankCardProps,
  RankingInfoProps,
  RankingListItemData,
} from "../model/Ranking";

const Ranking: React.FC = () => {
  const [info, setInfo] = useState<RankingInfoProps>({ totalParticipants: 0 });
  const [top10, setTop10] = useState<RankingListItemData[]>([]);
  const [me, setMe] = useState<MyRankCardProps | null>(null);

  // 랭킹 api 호출
  useEffect(() => {
    (async () => {
      try {
        const { info, top10, me } = await getRankingData();
        setInfo(info);
        setTop10(top10);
        // console.log("Top10 Data:", top10);
        setMe(me);
      } catch (error) {
        console.error("랭킹 데이터를 불러오지 못했습니다:", error);
      }
    })();
  }, []);

  return (
    <div>
      <Header leftChild="<" title="랭킹" />
      <RankingInfo totalParticipants={info.totalParticipants} />
      <RankingList items={top10} />
      {me && (
        <MyRankCard
          name={me.name}
          rank={me.rank}
          score={me.score}
          avatar={me.avatar}
        />
      )}
    </div>
  );
};

export default Ranking;
