import { useI18n } from "@app/i18n";
import { NavLink } from "react-router";
import "../style/TabNavigation.css";

const TabNavigation: React.FC = () => {
  const { t } = useI18n();

  const tabs = [
    {
      to: "/mypage/category/giftbox/history",
      label: t("mypage.history.tabs.history"),
    },
    {
      to: "/mypage/category/giftbox/coupons",
      label: t("mypage.history.tabs.coupons"),
    },
  ];

  return (
    <nav className="tab-navigation">
      <div className="tab-list">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            replace
            className={({ isActive }) =>
              isActive ? "tab-item active" : "tab-item"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
