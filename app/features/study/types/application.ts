import type { UserApplicationStatus } from "./study";

export interface ApplicationState {
  applicationText: string;
  isApplying: boolean;
  isApplicationModalOpen: boolean;
  userApplicationStatus: UserApplicationStatus;
  setApplicationText: (text: string) => void;
  setIsApplicationModalOpen: (open: boolean) => void;
  handleApply: () => Promise<void>;
  handleEditApplication?: () => Promise<void>;
  handleUpdateApplication?: () => Promise<void>;
  isLoadingApplicationDetail?: boolean;
  editingApplicationText: string;
  setEditingApplicationText: (text: string) => void;
}
