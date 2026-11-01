import { getMypage, updateProfileIcon } from "@app/api/generated/endpoints";
import { ProfileIcon } from "@app/api/generated/model";
import { Balance } from "@app/components/mypage/Balance";
import { PROFILE_ICONS } from "@app/components/mypage/mypage";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { RouteErrorState } from "@app/components/page/States";
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
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction, useFetcherResult } from "@app/lib/actions";
import { pageTitle, SITE_NAME } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import { CheckIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Outlet, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/layout";

export function meta() {
  return [{ title: pageTitle(translate("mypage.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { me: await getMypage({ signal: request.signal }) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();
  const profileIcon = String(form.get("profileIcon")) as ProfileIcon;
  return runAction("profile-icon", () => updateProfileIcon({ profileIcon }), {
    success: translate("mypage.profile.saved"),
  });
}

export function useMe() {
  const data = useRouteLoaderData<typeof clientLoader>("routes/mypage/layout");
  if (!data) throw new Error("useMe must be used below /mypage");
  return data.me;
}

export default function MypageLayout() {
  return (
    <div className="narrow-frame [--frame-width:75rem]">
      <Outlet />
    </div>
  );
}

/** Header and body of a page reached from the my page hub. */
export function Subpage({
  title,
  balance = false,
  children,
}: {
  title: string;
  /** On where the balance is what the page is about. */
  balance?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const me = useMe();
  return (
    <>
      <PageHeader
        className="border-b-0"
        back={{ to: "/mypage", label: t("mypage.metaTitle") }}
        title={title}
        actions={balance && <Balance amount={me.pointBalance} />}
        compact
      />
      <PageBody className="pt-0">{children}</PageBody>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}

export function ProfileIconDialog({ current }: { current: ProfileIcon }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProfileIcon>(current);
  const fetcher = useFetcher<typeof clientAction>({ key: "profile-icon" });
  const busy = fetcher.state !== "idle";
  const failed =
    fetcher.data?.ok === false && !busy ? fetcher.data.message : null;

  useFetcherResult(fetcher, (result) => {
    if (result.ok) setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        if (next) setSelected(current);
        setOpen(next);
      }}
    >
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
        <div
          role="radiogroup"
          aria-label={t("mypage.profile.title")}
          className="grid grid-cols-4 gap-3 sm:grid-cols-5"
        >
          {Object.values(ProfileIcon).map((icon) => {
            const checked = selected === icon;
            return (
              // biome-ignore lint/a11y/useSemanticElements: an image grid, not a native radio list
              <button
                key={icon}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={icon === "NONE" ? SITE_NAME : icon}
                onClick={() => setSelected(icon)}
                className={cn(
                  "relative aspect-square cursor-pointer rounded-full p-1.5 outline-none transition-[box-shadow,transform] duration-150",
                  "hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                  checked
                    ? "shadow-[inset_0_0_0_2px_var(--ink)]"
                    : "shadow-[inset_0_0_0_1px_var(--line)]"
                )}
              >
                <img src={PROFILE_ICONS[icon]} alt="" className="size-full" />
                {checked && (
                  <span className="absolute top-0 right-0 grid size-5 place-items-center rounded-full bg-ink text-paper">
                    <CheckIcon
                      aria-hidden="true"
                      strokeWidth={3}
                      className="size-3"
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {failed && (
          <p
            role="alert"
            className="m-0 text-[0.875rem] font-[650] text-danger"
          >
            {failed}
          </p>
        )}
        <DialogFooter>
          <DialogClose
            disabled={busy}
            render={<Button variant="outline">{t("common.cancel")}</Button>}
          />
          <Button
            disabled={busy || selected === current}
            onClick={() =>
              fetcher.submit(
                { profileIcon: selected },
                { method: "post", action: "/mypage" }
              )
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
