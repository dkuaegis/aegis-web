// 랭킹 정보 (타이틀)
export interface RankingInfoProps {
  totalParticipants: number;
}

// 랭킹 리스트 아이템 데이터
export interface RankingListItemData {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

// 랭킹 리스트 배열
export interface RankingListProps {
  items: RankingListItemData[];
}

// 내 랭킹 카드
export interface MyRankCardProps {
  name: string;
  rank: number;
  score: number;
  avatar: string;
}
