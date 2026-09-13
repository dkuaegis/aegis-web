import { t } from "@app/i18n/store";
import { AcquisitionType } from "@join/types/api/survey";
import { z } from "zod";

// Messages are functions so they follow the language selected at validation
// time rather than the one active when this module was first imported.
export const surveySchema = z.object({
  joinReason: z
    .string()
    .min(5, { error: () => t("join.survey.validation.joinReasonMin") })
    .max(511, { error: () => t("join.survey.validation.joinReasonMax") }),
  acquisitionType: z.enum(
    Object.values(AcquisitionType) as [string, ...string[]],
    { error: () => t("join.survey.validation.acquisitionRequired") }
  ),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;
