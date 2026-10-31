import { t } from "@app/i18n/store";
import { Department, Grade } from "@join/types/api/member";
import * as z from "zod/mini";
import { isValidBirthDate } from "./PersonalInfo.helper";

/**
 * Every message is a function rather than a string. The schema is built once at
 * module load, but validation can run long after the visitor has switched
 * language, so the message has to be resolved at validation time.
 */
export const personalInfoSchema = z.object({
  birthDate: z.string().check(
    z.length(6, {
      error: () => t("join.personalInfo.validation.birthDateLength"),
    }),
    z.refine(isValidBirthDate, {
      error: () => t("join.personalInfo.validation.birthDateInvalid"),
    })
  ),
  residentNumber_back: z.string().check(
    z.regex(/^[1-8]$/, {
      error: () => t("join.personalInfo.validation.genderDigit"),
    })
  ),
  studentId: z.string().check(
    z.length(8, {
      error: () => t("join.personalInfo.validation.studentIdLength"),
    }),
    z.refine((val) => /^32\d{6}$/.test(val), {
      error: () => t("join.personalInfo.validation.studentIdFormat"),
    })
  ),
  phoneNumber: z.string().check(
    z.minLength(1, {
      error: () => t("join.personalInfo.validation.phoneRequired"),
    }),
    z.refine(
      (val) => {
        const phoneRegex = /^(01[016789])-?[0-9]{3,4}-?[0-9]{4}$/;
        return phoneRegex.test(val);
      },
      { error: () => t("join.personalInfo.validation.phoneFormat") }
    )
  ),
  department: z.enum(Object.values(Department) as [string, ...string[]], {
    error: () => t("join.personalInfo.validation.departmentRequired"),
  }),
  grade: z.enum(Object.values(Grade) as [string, ...string[]], {
    error: () => t("join.personalInfo.validation.gradeRequired"),
  }),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export type PersonalInfoApiValues = Omit<
  PersonalInfoFormValues,
  "residentNumber_back"
> & { gender: "MALE" | "FEMALE" };
