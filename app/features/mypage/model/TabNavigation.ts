export interface TabItem {
  id: string;
  label: string;
}

export interface TabNavigationProps {
  tabs?: TabItem[];
  onTabChange?: (tabId: string) => void;
  defaultTab?: string;
}
