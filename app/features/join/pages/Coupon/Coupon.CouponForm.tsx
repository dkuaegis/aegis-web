import { useI18n } from "@app/i18n";
import { Button } from "@join/components/ui/button";
import { Input } from "@join/components/ui/input";
import { Label } from "@join/components/ui/label";
import React from "react";

interface CouponFormProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CouponForm: React.FC<CouponFormProps> = React.memo(
  ({ couponCode, setCouponCode, handleSubmit }) => {
    const { t } = useI18n();

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="couponCode">{t("join.coupon.codeInputLabel")}</Label>
          <Input
            id="couponCode"
            placeholder={t("join.coupon.codeInputPrompt")}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          {t("join.coupon.registerLong")}
        </Button>
      </form>
    );
  }
);

CouponForm.displayName = "CouponForm";
export default CouponForm;
