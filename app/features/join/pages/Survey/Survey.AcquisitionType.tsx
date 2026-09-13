import { useI18n } from "@app/i18n";
import ClubFairIcon from "@join/assets/club-fair.svg";
import EtcIcon from "@join/assets/etc.svg";
import EverytimeIcon from "@join/assets/everytime.svg";
import FriendIcon from "@join/assets/friend.svg";
import InstagramIcon from "@join/assets/instargram-logo.svg";
import OfflineEventIcon from "@join/assets/offline-event.svg";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Label } from "@join/components/ui/label";
import { AcquisitionType as AcquisitionTypeEnum } from "@join/types/api/survey";
import { useFormContext } from "react-hook-form";
import { AcquisitionCard } from "./AcquisitionCard";
import type { SurveyFormValues } from "./Survey.schema";

/** 값은 API 계약이고, 표시 이름은 언어별 사전에서 가져옵니다. */
const acquisitionTypes = [
  { value: AcquisitionTypeEnum.INSTAGRAM, icon: InstagramIcon },
  { value: AcquisitionTypeEnum.EVERYTIME, icon: EverytimeIcon },
  { value: AcquisitionTypeEnum.FRIEND, icon: FriendIcon },
  { value: AcquisitionTypeEnum.CLUB_FAIR, icon: ClubFairIcon },
  { value: AcquisitionTypeEnum.OFFLINE_EVENT, icon: OfflineEventIcon },
  { value: AcquisitionTypeEnum.ETC, icon: EtcIcon },
];

export const AcquisitionType = () => {
  const { t } = useI18n();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const selectedValue = watch("acquisitionType");

  return (
    <div className="space-y-2">
      <Label htmlFor="acquisitionType" className="text-lg">
        {t("join.survey.acquisitionLabel")}
      </Label>
      <div className="grid auto-rows-fr grid-cols-3 gap-4">
        {acquisitionTypes.map(({ value, icon }) => (
          <AcquisitionCard
            key={value}
            label={t(`join.survey.acquisitionTypes.${value}`)}
            icon={icon}
            isSelected={selectedValue === value}
            onClick={() =>
              setValue("acquisitionType", value, { shouldValidate: true })
            }
          />
        ))}
      </div>
      <ErrorMessage
        isShown={!!errors.acquisitionType}
        message={errors.acquisitionType?.message}
      />
    </div>
  );
};

AcquisitionType.displayName = "AcquisitionType";
