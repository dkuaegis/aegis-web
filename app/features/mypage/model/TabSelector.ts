export interface TabSelectorProps {
  tabs: string[];
  selected: number;
  onSelect: (idx: number) => void;
}
