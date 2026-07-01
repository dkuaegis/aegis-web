import { Button } from "@join/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@join/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@join/components/ui/drawer";
import useMediaQuery from "@join/hooks/useMediaQuery";
import { Analytics } from "@join/service/analytics";
import { Info } from "lucide-react";

interface NoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoticeModal = ({ open, onOpenChange }: NoticeModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleConfirm = () => {
    Analytics.safeTrack("Payment_Notice_Modal_Confirm", {
      category: "Payment",
    });
    onOpenChange(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Info className="h-5 w-5" />
              송금 후 다시 방문해 주세요
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground leading-relaxed">
            <p>송금이 완료되면 오픈채팅방 가입이 가능합니다.</p>
            <p>송금 완료 후 반드시 이 페이지로 다시 돌아와 주세요.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleConfirm} className="w-full">
              확인했습니다
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5" />
            송금 후 다시 방문해 주세요
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4 text-muted-foreground leading-relaxed">
          <p>송금이 완료되면 오픈채팅방 가입이 가능합니다.</p>
          <p>송금 완료 후 반드시 이 페이지로 다시 돌아와 주세요.</p>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button onClick={handleConfirm} className="w-full">
              확인했습니다
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NoticeModal;
