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

const acquisitionTypes = [
  {
    value: AcquisitionTypeEnum.INSTAGRAM,
    label: "인스타그램",
    icon: InstagramIcon,
  },
  {
    value: AcquisitionTypeEnum.EVERYTIME,
    label: "에브리타임",
    icon: EverytimeIcon,
  },
  { value: AcquisitionTypeEnum.FRIEND, label: "지인 추천", icon: FriendIcon },
  { value: AcquisitionTypeEnum.CLUB_FAIR, label: "알림제", icon: ClubFairIcon },
  {
    value: AcquisitionTypeEnum.OFFLINE_EVENT,
    label: "오프라인 행사",
    icon: OfflineEventIcon,
  },
  { value: AcquisitionTypeEnum.ETC, label: "기타", icon: EtcIcon },
];

export const AcquisitionType = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const selectedValue = watch("acquisitionType");

  return (
    <div className="space-y-2">
      <Label htmlFor="acquisitionType" className="text-lg">
        유입 경로
      </Label>
      <div className="grid auto-rows-fr grid-cols-3 gap-4">
        {acquisitionTypes.map(({ value, label, icon }) => (
          <AcquisitionCard
            key={value}
            label={label}
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
