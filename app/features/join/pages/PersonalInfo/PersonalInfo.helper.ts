import type {
  PersonalInfoApiValues,
  PersonalInfoFormValues,
} from "./PersonalInfo.schema";

export const formatPhoneNumber = (rawValue: string): string => {
  const sanitizedValue = rawValue.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거

  if (sanitizedValue.length <= 3) {
    return sanitizedValue;
  }
  if (sanitizedValue.length <= 7) {
    return `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3)}`;
  }
  return `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3, 7)}-${sanitizedValue.slice(7, 11)}`;
};

export const isValidBirthDate = (birthDate: string): boolean => {
  if (!/^\d{6}$/.test(birthDate)) {
    return false; // 형식이 YYMMDD가 아니면 false
  }
  const year = Number.parseInt(birthDate.substring(0, 2), 10);
  const month = Number.parseInt(birthDate.substring(2, 4), 10);
  const day = Number.parseInt(birthDate.substring(4, 6), 10);

  const fullYear = year >= 50 ? 1900 + year : 2000 + year;

  const date = new Date(fullYear, month - 1, day);

  return (
    date.getFullYear() === fullYear &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

export const transformFetchedDataToFormValues = (
  fetchedData: PersonalInfoApiValues
): PersonalInfoFormValues => {
  const { gender, ...rest } = fetchedData;

  const birthYear = parseInt(fetchedData.birthDate.substring(0, 2), 10);
  let residentNumber_back: string;

  if (gender === "MALE") {
    // 2000년 이전 출생(yy가 50 이상)이면 1, 이후면 3
    residentNumber_back = birthYear >= 50 ? "1" : "3";
  } else {
    // FEMALE
    // 2000년 이전 출생이면 2, 이후면 4
    residentNumber_back = birthYear >= 50 ? "2" : "4";
  }
  // 변환된 데이터를 포함하여 폼이 필요로 하는 최종 객체를 반환
  return {
    ...rest,
    residentNumber_back, // 나머지 6자리는 없으므로 첫 글자만 예시로 넣음
  };
};
