import { useI18n } from "@app/i18n";
import { useEffect, useRef, useState } from "react";
import type { IconKey } from "../constants/ProfileIcons";
import { PROFILE_ICONS } from "../constants/ProfileIcons";
import type { ProfileEditModalProps } from "../model/ProfileEditModal";
import Button from "./Button";
import ModalDialog from "./ModalDialog";
import "../style/ProfileEditModal.css";
import { ProfileEdit } from "../api/ProfileEdit";
import { showError } from "../utils/alert";

const IMAGES_PER_PAGE = 8;
const PAGE_WIDTH = 400;

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  name,
  selectedKey,
  imageKeys,
  onSelectKey,
  onClose,
}) => {
  const { t } = useI18n();
  const [tempKey, setTempKey] = useState<IconKey>(selectedKey);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
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
    if (isSaving) return;
    setIsSaving(true);
    try {
      await ProfileEdit(tempKey);
      onSelectKey(tempKey);
      onClose();
    } catch (e) {
      showError(
        e instanceof Error ? e.message : t("mypage.errors.profileSave")
      );
    } finally {
      setIsSaving(false);
    }
  };

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
    <ModalDialog className="profile-modal-overlay" onClose={onClose}>
      <div className="profile-modal">
        <ModalDialog.Title className="profile-title">
          {t("mypage.profile.editTitle", { name })
            .split("\n")
            .map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
        </ModalDialog.Title>
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
            disabled={isSaving}
          />
        </div>
      </div>
    </ModalDialog>
  );
};

export default ProfileEditModal;
