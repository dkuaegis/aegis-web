import { toast } from "@app/components/ui/toast";
import { t } from "@app/i18n/store";

export async function copyToClipboard(
  text: string,
  success: string = t("common.copied")
) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(success);
  } catch {
    toast.error(t("common.copyFailed"));
  }
}
