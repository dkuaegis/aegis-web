import { ProfileIcon } from "@app/api/generated/model";
import { Button } from "@app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import { ErrorText } from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { type ActionResult, useActionDialog } from "@app/lib/actions";
import { SITE_NAME } from "@app/lib/title";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { CheckIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { PROFILE_ICONS } from "./mypage";

/** Submits to the action of the route it is rendered in. */
export function ProfileIconDialog({ current }: { current: ProfileIcon }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<ProfileIcon>(current);
  const { fetcher, busy, failed, dialog } = useActionDialog<ActionResult>({
    onOpen: () => setSelected(current),
  });

  return (
    <Dialog {...dialog}>
      <DialogTrigger
        aria-label={t("mypage.profile.edit")}
        className="group relative size-[clamp(4.5rem,8vw,5.75rem)] shrink-0 cursor-pointer"
      >
        <img
          src={PROFILE_ICONS[current]}
          alt=""
          className="size-full transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute right-0 bottom-0 grid size-7 place-items-center rounded-full border-2 border-paper bg-ink text-paper transition-colors group-hover:bg-blue">
          <PencilIcon aria-hidden="true" className="size-3.5" />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("mypage.profile.title")}</DialogTitle>
          <DialogDescription>
            {t("mypage.profile.description")}
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          aria-label={t("mypage.profile.title")}
          value={selected}
          onValueChange={(value) => setSelected(value as ProfileIcon)}
          className="grid grid-cols-4 gap-3 sm:grid-cols-5"
        >
          {Object.values(ProfileIcon).map((icon) => (
            <Radio.Root
              key={icon}
              value={icon}
              aria-label={icon === "NONE" ? SITE_NAME : icon}
              className="relative aspect-square cursor-pointer rounded-full p-1.5 shadow-[inset_0_0_0_1px_var(--line)] outline-none transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue data-checked:shadow-[inset_0_0_0_2px_var(--ink)]"
            >
              <img src={PROFILE_ICONS[icon]} alt="" className="size-full" />
              <Radio.Indicator className="absolute top-0 right-0 grid size-5 place-items-center rounded-full bg-ink text-paper">
                <CheckIcon
                  aria-hidden="true"
                  strokeWidth={3}
                  className="size-3"
                />
              </Radio.Indicator>
            </Radio.Root>
          ))}
        </RadioGroup>
        <ErrorText role="alert">{failed}</ErrorText>
        <DialogFooter>
          <DialogClose
            disabled={busy}
            render={<Button variant="outline">{t("common.cancel")}</Button>}
          />
          <Button
            disabled={busy || selected === current}
            onClick={() =>
              fetcher.submit({ profileIcon: selected }, { method: "post" })
            }
          >
            {busy && <Spinner />}
            {t("mypage.profile.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
