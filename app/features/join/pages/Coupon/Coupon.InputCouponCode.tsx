import { Button } from "@join/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@join/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@join/components/ui/drawer";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { submitAndFetchCouponCode } from "./Coupon.Api";
import CouponForm from "./Coupon.CouponForm";
import type { Coupon } from "./Coupon.Types";

interface InputCouponCodeProps {
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
}

const InputCouponCode = ({ setCoupons }: InputCouponCodeProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmedCouponCode = couponCode.trim();
      if (!trimmedCouponCode) {
        toast.error("쿠폰 코드를 입력해주세요");
        return;
      }
      const data = await submitAndFetchCouponCode(trimmedCouponCode);
      setCoupons(data);
      setOpen(false);
      setCouponCode("");
    } catch (error: unknown) {
      console.error("쿠폰 코드 적용하는데 에러", error);
    }
  };

  if (isMobile) {
    return (
      <div className="flex justify-center">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" className="w-full items-center" variant="default">
              쿠폰 등록하기
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>쿠폰 등록</DrawerTitle>
              <DrawerDescription>
                보유하신 쿠폰 코드를 입력해주세요.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <CouponForm
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleSubmit={handleSubmit}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">취소</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full items-center" variant="default">
            코드로 쿠폰 등록하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>쿠폰 등록</DialogTitle>
            <DialogDescription>
              보유하신 쿠폰 코드를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <CouponForm
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InputCouponCode;
