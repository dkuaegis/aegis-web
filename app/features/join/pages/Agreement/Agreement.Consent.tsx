import { useI18n } from "@app/i18n";
import { Checkbox } from "@join/components/ui/checkbox";
import type { ConsentState } from "@join/constants/regulation";

interface AgreementConsentProps {
  consent: ConsentState;
  onConsentChange: (key: keyof ConsentState, checked: boolean) => void;
}

const AgreementConsent = ({
  consent,
  onConsentChange,
}: AgreementConsentProps) => {
  const { t } = useI18n();

  return (
    <div className="my-6 space-y-4 border-t p-4 pb-18">
      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3">
          <Checkbox
            id="regulations"
            checked={consent.regulations}
            onCheckedChange={(checked) =>
              onConsentChange("regulations", checked as boolean)
            }
            className="mt-0.5"
          />
          <label
            htmlFor="regulations"
            className="cursor-pointer text-gray-700 text-sm"
          >
            <span className="text-red-500">
              {t("join.regulation.consent.requiredTag")}
            </span>
            {t("join.regulation.consent.regulations")}
          </label>
        </div>

        <div className="flex items-start space-x-3 p-3 pt-0">
          <Checkbox
            id="privacy"
            checked={consent.privacy}
            onCheckedChange={(checked) =>
              onConsentChange("privacy", checked as boolean)
            }
            className="mt-0.5"
          />
          <label
            htmlFor="privacy"
            className="cursor-pointer text-gray-700 text-sm"
          >
            <span className="text-red-500">
              {t("join.regulation.consent.requiredTag")}
            </span>
            {t("join.regulation.consent.privacy")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default AgreementConsent;
