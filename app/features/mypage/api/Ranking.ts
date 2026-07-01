import { PROFILE_ICONS } from "../constants/ProfileIcons";
import type {
  MyRankCardProps,
  RankingInfoProps,
  RankingListItemData,
} from "../model/Ranking";
import NoneIcon from "../public/NONE.svg";
import { getAxiosErrorMessage, mypageApiClient } from "./client";

export async function getRankingData(): Promise<{
  info: RankingInfoProps;
  top10: RankingListItemData[];
  me: MyRankCardProps | null;
}> {
  let json: {
    memberCount: number;
    top10: {
      rank: number;
      name: string;
      totalEarnedPoints: number;
      profileIcon: string | null;
    }[];
    me: {
      rank: number;
      name: string;
      totalEarnedPoints: number;
      profileIcon: string | null;
    };
  };

  try {
    const response = await mypageApiClient.get<typeof json>("/points/ranking", {
      headers: { accept: "application/json" },
    });
    json = response.data;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error, "랭킹 조회 실패"));
  }

  const sortedTop10 = [...json.top10].sort((a, b) => a.rank - b.rank);

  return {
    info: { totalParticipants: json.memberCount },
    top10: sortedTop10.map((u) => ({
      rank: u.rank,
      name: u.name,
      score: u.totalEarnedPoints,
      avatar: u.profileIcon ? PROFILE_ICONS[u.profileIcon] : NoneIcon,
    })),
    me: json.me
      ? {
          rank: json.me.rank,
          name: json.me.name,
          score: json.me.totalEarnedPoints,
          avatar: json.me.profileIcon
            ? PROFILE_ICONS[json.me.profileIcon]
            : NoneIcon,
        }
      : null,
  };
}
