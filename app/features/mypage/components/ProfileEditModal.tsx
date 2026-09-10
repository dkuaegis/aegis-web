import { useI18n } from "@app/i18n";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IconKey } from "../constants/ProfileIcons";
import { PROFILE_ICONS } from "../constants/ProfileIcons";
import type { ProfileEditModalProps } from "../model/ProfileEditModal";
import Button from "./Button";
import "../style/ProfileEditModal.css";
import { getMyPage } from "../api/Mypage";
import { ProfileEdit } from "../api/ProfileEdit";

// import { toIconId } from "../utils/Icon";

const IMAGES_PER_PAGE = 8;
const PAGE_WIDTH = 400;

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  selectedKey,
  imageKeys,
  onSelectKey,
  onClose,
}) => {
  const { t } = useI18n();
  const [tempKey, setTempKey] = useState<IconKey>(selectedKey);
  const [mypage, setMypage] = useState<{
    name: string;
    profileIcon: string;
    pointBalance: number;
  } | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempKey(selectedKey);
  }, [selectedKey]);

  const totalPages = Math.ceil(imageKeys.length / IMAGES_PER_PAGE);
  // 페이지별 이미지 배열
  const pages = Array.from({ length: totalPages }, (_, i) =>
    imageKeys.slice(i * IMAGES_PER_PAGE, (i + 1) * IMAGES_PER_PAGE)
  );
  const pageIndexes = Array.from({ length: totalPages }, (_, i) => ({
    id: `profile-page-dot-${i + 1}`,
    index: i,
  }));

  const handleSave = async () => {
    try {
      await ProfileEdit(tempKey);
      onSelectKey(tempKey);
      onClose();
    } catch (e) {
      console.error("프로필 아이콘 저장 실패:", e);
    }
  };

  // 사용자 정보 조회 API 호출
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPage();
        setMypage(data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        navigate("/mypage/login/auth");
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / PAGE_WIDTH);
      setCurrentPage(Math.min(Math.max(idx, 0), totalPages - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalPages]);

  // 도트 클릭 시 해당 페이지로 스크롤
  const scrollToPage = (idx: number) => {
    const el = gridRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * PAGE_WIDTH,
      behavior: "smooth",
    });
    setCurrentPage(idx);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2 className="profile-title">
          {t("mypage.profile.editTitle", { name: mypage?.name ?? "" })
            .split("\n")
            .map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
        </h2>
        <img
          src={PROFILE_ICONS[tempKey]}
          alt="profile-img"
          className="profile-current-img"
        />
        <div className="image-grid" ref={gridRef}>
          {pages.map((keys) => (
            <div className="image-page" key={keys.join("-")}>
              {keys.map((key) => (
                <button
                  key={key}
                  className={`profile-option-img ${tempKey === key ? "selected" : ""}`}
                  onClick={() => setTempKey(key)}
                  type="button"
                >
                  <img src={PROFILE_ICONS[key]} alt={key} />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div
          className="pager"
          role="tablist"
          aria-label={t("mypage.profile.pagerLabel")}
        >
          {pageIndexes.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`pager-dot ${page.index === currentPage ? "active" : ""}`}
              onClick={() => scrollToPage(page.index)}
              role="tab"
              aria-selected={page.index === currentPage}
              aria-label={t("mypage.profile.goToPage", {
                page: page.index + 1,
              })}
            />
          ))}
        </div>
        <div className="button-group">
          <Button
            text={t("mypage.profile.leave")}
            type={"EDITRETURN"}
            onClick={onClose}
          />
          <Button
            text={t("mypage.profile.save")}
            type={"EDITSAVE"}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
