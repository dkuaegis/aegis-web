import "../style/EmptyState.css";
import { useI18n } from "@app/i18n";
import cartIcon from "../assets/cart.webp";
import type { EmptyStateProps } from "../model/EmptyState";

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const { t } = useI18n();

  return (
    <div className="empty-state">
      <img src={cartIcon} alt="" aria-hidden="true" className="empty-state-image" />
      <p className="empty-state-text">{t(`mypage.emptyState.${type}`)}</p>
    </div>
  );
};

export default EmptyState;
