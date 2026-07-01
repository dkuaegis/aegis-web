import type { ReactNode } from "react";

export interface HeaderProps {
  title: string;
  leftChild?: ReactNode;
  backPath?: string;
}
