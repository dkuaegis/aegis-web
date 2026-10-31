export type GachaItem = {
  id: string;
  label: string;
  color?: string; // 공 색
  weight?: number; // 확률 가중치
  imageSrc?: string; // 상품 이미지
};

export interface GachaMachine3DProps {
  items: GachaItem[];
  width?: number | string;
  height?: number | string;
  className?: string;
  modelScale?: number;
}

export type GachaResultCardProps = {
  item: {
    label: string;
    imageSrc?: string;
    description?: string;
  };
  onClose: () => void;
};
