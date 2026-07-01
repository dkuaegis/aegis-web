export interface ButtonProps {
  text: React.ReactNode;
  type: string;
  onClick: () => void;
  className?: string;
  usePortal?: boolean;
}
