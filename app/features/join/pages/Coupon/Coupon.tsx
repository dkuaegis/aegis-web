import { useI18n } from "@app/i18n";
import { Button } from "@join/components/ui/button";
import { Input } from "@join/components/ui/input";
import { Analytics } from "@join/service/analytics";
import { CircleAlert, Loader2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchCoupon,
  submitAndFetchCouponCode,
  submitCoupon,
} from "./Coupon.Api";
import { CouponList } from "./Coupon.CouponList";
import type { Coupon as CouponType } from "./Coupon.Types";

interface CouponProps {
  onClose: () => void;
}

const Coupon = ({ onClose }: CouponProps) => {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Analytics.safeTrack("Coupon_Fetch_Start", { category: "Payment" });
        const data = await fetchCoupon();
        setCoupons(data);
        Analytics.safeTrack("Coupon_Fetch_Success", {
          category: "Payment",
          coupon_count: data.length,
        });
      } catch (error) {
        console.error("쿠폰 불러오는데 오류 발생:", error);
        Analytics.safeTrack("Coupon_Fetch_Failed", {
          category: "Payment",
          error_message:
            error instanceof Error ? error.message : String(error ?? ""),
        });
      }
    };
    fetchData();
  }, []);

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      Analytics.safeTrack("Coupon_Apply_Start", {
        category: "Payment",
        selected_count: selectedCoupons.length,
      });
      await submitCoupon(selectedCoupons);
      Analytics.safeTrack("Coupon_Apply_Success", {
        category: "Payment",
        selected_count: selectedCoupons.length,
      });
    } catch (error: unknown) {
      console.error("제출 중 오류 발생:", error);
      Analytics.safeTrack("Coupon_Apply_Failed", {
        category: "Payment",
        selected_count: selectedCoupons.length,
        error_message:
          error instanceof Error ? error.message : String(error ?? ""),
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleCodeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) {
      toast.error(t("join.coupon.codeRequired"));
      return;
    }
    setIsSubmitting(true);
    try {
      setCoupons(await submitAndFetchCouponCode(code));
      setCouponCode("");
      toast.success(t("join.coupon.registerSuccess"));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("join.coupon.registerFailure")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-3">
      <form
        className="flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-blue-500"
        onSubmit={handleCodeSubmit}
      >
        <Input
          aria-label={t("join.coupon.codeInputLabel")}
          className="rounded-none border-0 shadow-none focus-visible:ring-0"
          placeholder={t("join.coupon.codeInputPlaceholder")}
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
        />
        <Button
          className="h-12 rounded-none px-5"
          type="submit"
          disabled={isSubmitting}
        >
          {t("join.coupon.register")}
        </Button>
      </form>
      <div className="max-h-[min(45vh,360px)] overflow-y-auto py-1">
        {coupons.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-4 text-slate-500 text-sm">
            <CircleAlert className="h-4 w-4 shrink-0" />
            <p>{t("join.coupon.empty")}</p>
          </div>
        ) : (
          <CouponList
            coupons={coupons}
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
          />
        )}
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={isSubmitting}
        onClick={handleApply}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          t("join.coupon.applySelected")
        )}
      </Button>
    </div>
  );
};

export default Coupon;
