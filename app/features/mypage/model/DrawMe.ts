// 포인트샵 뽑기 이력 아이템
export interface DrawHistoryItem {
  drawHistoryId: number;
  item: string;
  transactionId: number;
  createdAt: string;
}

// 포인트샵 뽑기 이력 배열
export interface DrawHistoryProps {
  items: DrawHistoryItem[];
}
