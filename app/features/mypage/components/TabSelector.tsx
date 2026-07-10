import "../style/TabSelector.css";
import type { TabSelectorProps } from "../model/TabSelector";

const TabSelector = ({ tabs, selected, onSelect }: TabSelectorProps) => {
  return (
    <div className="tab-selector">
      {tabs.map((tab, idx) => (
        <button
          type="button"
          key={tab}
          className={`tab-btn${selected === idx ? " selected" : ""}`}
          onClick={() => onSelect(idx)}
          aria-pressed={selected === idx}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
