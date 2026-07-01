import { useEffect, useState } from "react";
import "../style/Profile.css";
import editIcon from "../assets/edit.svg";
import type { IconKey } from "../constants/ProfileIcons";
import { ICON_KEYS, PROFILE_ICONS } from "../constants/ProfileIcons";
import ProfileEditModal from "./ProfileEditModal";

interface ProfileProps {
  mypage: { name: string; profileIcon: string; pointBalance: number } | null;
}

const Profile: React.FC<ProfileProps> = ({ mypage }) => {
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<IconKey>(
    mypage?.profileIcon || "NONE"
  );

  // mypage 데이터가 변경될 때 selectedKey 업데이트
  useEffect(() => {
    if (mypage?.profileIcon) {
      setSelectedKey(mypage.profileIcon);
    }
  }, [mypage]);

  return (
    <div className="Profile">
      <div className="profile_img" style={{ position: "relative" }}>
        <img src={PROFILE_ICONS[selectedKey]} alt="profile img" />
        <button
          type="button"
          className="profile_edit"
          onClick={() => setShowProfileEditModal(true)}
          aria-label="프로필 이미지 변경"
        >
          <img src={editIcon} alt="" aria-hidden="true" />
        </button>
      </div>
      <div className="profile_info">
        <div className="profile_name">{mypage?.name}</div>
        <div className="profile_greeting">
          환영합니다!
          <br />
          Aegis와 함께해요❤
        </div>
      </div>

      {showProfileEditModal && (
        <ProfileEditModal
          selectedKey={selectedKey}
          imageKeys={ICON_KEYS}
          onSelectKey={setSelectedKey}
          onClose={() => setShowProfileEditModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
