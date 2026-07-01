import { Department, Grade } from "@join/types/api/member";
import { z } from "zod";
import { isValidBirthDate } from "./PersonalInfo.helper";

// 생년월일 유효성 검사 함수 (YYMMDD 형식, 월/일 범위만 체크)

export const personalInfoSchema = z.object({
  birthDate: z
    .string()
    .length(6, { error: "생년월일을 6자리로 입력해주세요 (YYMMDD)" })
    .refine(
      isValidBirthDate,
      "유효하지 않은 생년월일입니다 (월/일 범위: 1~12, 1~31)"
    ),
  residentNumber_back: z
    .string()
    .regex(/^[1-8]$/, { error: "성별은 1에서 8 사이의 숫자여야 합니다." }),
  studentId: z
    .string()
    .length(8, { error: "학번은 8자리여야 합니다" })
    .refine(
      (val) => /^32\d{6}$/.test(val),
      "학번은 32로 시작하는 8자리 숫자여야 합니다"
    ),
  phoneNumber: z
    .string()
    .min(1, { error: "전화번호를 입력해주세요" })
    .refine((val) => {
      const phoneRegex = /^(01[016789])-?[0-9]{3,4}-?[0-9]{4}$/;
      return phoneRegex.test(val);
    }, "전화번호 형식이 올바르지 않습니다"),
  department: z.enum(Object.values(Department) as [string, ...string[]], {
    error: "학과를 선택해주세요",
  }),
  grade: z.enum(Object.values(Grade) as [string, ...string[]], {
    error: "학년을 선택해주세요",
  }),
});

export const personalInfoApiSchema = personalInfoSchema
  .omit({ residentNumber_back: true })
  .extend({
    gender: z.enum(["MALE", "FEMALE"]),
  });

export type PersonalInfoApiValues = z.infer<typeof personalInfoApiSchema>;
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
