import "../style/EmptyState.css";
import cartIcon from "../assets/cart.webp";
import type { EmptyStateProps } from "../model/EmptyState";

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const message = `${
    type === "point"
      ? "현재 보유하고 있는 포인트가"
      : type === "coupon"
        ? "현재 보유하고 있는 쿠폰이"
        : "현재 존재하는 뽑기내역이"
  } 없어요!`;

  return (
    <div className="empty-state">
      <img src={cartIcon} alt="No data" className="empty-state-image" />
      <p className="empty-state-text">{message}</p>
    </div>
  );
};

export default EmptyState;
