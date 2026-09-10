import { useI18n } from "@app/i18n";
import { Button } from "@join/components/ui/button";
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

const AdminInfoDrawer = () => {
  const { t } = useI18n();

  return (
    <Drawer>
      <DrawerTrigger>
        <p className="text-start text-slate-500 underline">
          {t("join.payment.adminDrawer.triggerLead")}
          <span className="font-extrabold">
            {t("join.payment.adminDrawer.triggerStrong")}
          </span>
        </p>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("join.payment.adminDrawer.title")}</DrawerTitle>
          <DrawerDescription>
            {t("join.payment.adminDrawer.phoneLabel")}:{" "}
            {import.meta.env.VITE_ADMIN_PHONE} <br />
            {t("join.payment.adminDrawer.kakaoLabel")}:{" "}
            {import.meta.env.VITE_ADMIN_KAKAO}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              {t("common.close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminInfoDrawer;
