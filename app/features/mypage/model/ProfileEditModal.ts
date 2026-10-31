import type { IconKey } from "../constants/ProfileIcons";

export interface ProfileEditModalProps {
  name: string;
  selectedKey: IconKey;
  imageKeys: IconKey[];
  onSelectKey: (key: IconKey) => void;
  onClose: () => void;
}
