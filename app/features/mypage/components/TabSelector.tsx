import { useState } from "react";
import "../style/TabSelector.css";
import type { TabSelectorProps } from "../model/TabSelector";

const TabSelector = ({ tabs, selected, onSelect }: TabSelectorProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="tab-selector">
      {tabs.map((tab, idx) => (
        <button
          type="button"
          key={tab}
          className={`tab-btn${selected === idx ? " selected" : ""}${hovered === idx && selected !== idx ? " hovered" : ""}`}
          onClick={() => onSelect(idx)}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
