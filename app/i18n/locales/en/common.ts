export const common = {
  languageToggleLabel: "Language",
  address: "Room 530, Hyedang Hall, Dankook University (Jukjeon Campus)",

  loading: "Loading...",
  retry: "Try again",
  close: "Close",
  decrease: "Decrease",
  increase: "Increase",
  cancel: "Cancel",
  back: "Back",
  save: "Save",
  confirm: "Confirm",
  copy: "Copy",
  copied: "Copied.",
  copyFailed: "Could not copy. Please select the text and copy it yourself.",

  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainMenu: "Main menu",
  mobileMainMenu: "Mobile main menu",

  site: {
    brandHome: "AEGIS home",
    skipLink: "Skip to content",
    footerLinks: "Social and contact links",
    nav: {
      login: "Log in",
      join: "Join",
      continueJoin: "Continue joining",
      study: "Studies",
      mypage: "My page",
    },
  },

  states: {
    loadFailed: "We could not load this.",
    notFoundTitle: "This page does not exist",
    notFoundDescription:
      "It may have moved or been removed. Try again from the home page.",
    forbiddenTitle: "You cannot view this page",
    signedOutTitle: "Please sign in again",
    signedOutDescription:
      "Your session expired. Sign in and you will come back here.",
    signIn: "Sign in",
    errorEyebrow: "Error",
    errorTitle: "Something went wrong",
    errorDescription:
      "Please try again in a moment. If it keeps happening, let the organizers know.",
    crashDescription: "If reloading does not fix it, let the organizers know.",
    goHome: "Go home",
    reload: "Reload",
  },

  error: {
    badRequest: "Please check what you entered and try again.",
    unauthorized: "You need to log in first.",
    forbidden: "You do not have permission to do that.",
    notFound: "We could not find what you asked for.",
    conflict: "That request has already been handled.",
    network: "Check your network connection and try again.",
    timeout:
      "The server is taking too long to respond. Please try again in a moment.",
    unknown: "Something went wrong. Please try again in a moment.",
  },

  errorCode: {
    UNAUTHORIZED: "You need to log in again.",
    FORBIDDEN: "Only members for this term can use this.",
    MEMBER_SIGNUP_CLOSED: "Sign-ups are closed right now.",
    STUDY_CREATION_CLOSED: "New studies cannot be opened right now.",
    STUDY_ENROLLMENT_CLOSED: "Study applications are closed right now.",
    STUDY_NOT_FOUND: "We could not find that study.",
    STUDY_FULL: "This study is full.",
    STUDY_MEMBER_NOT_INSTRUCTOR: "Only the study lead can do that.",
    STUDY_MEMBER_NOT_PARTICIPANT: "Only members of this study can check in.",
    STUDY_APPLICATION_NOT_FOUND: "We could not find that application.",
    STUDY_APPLICATION_ALREADY_EXISTS:
      "You have already joined or applied to this study.",
    STUDY_APPLICATION_ALREADY_APPROVED:
      "An approved application can no longer be edited.",
    STUDY_APPLICATION_REASON_REQUIRED: "Please tell us why you want to join.",
    STUDY_APPLICATION_ACCESS_DENIED: "You can only view your own application.",
    STUDY_APPLICATION_STATUS_NOT_SUPPORTED:
      "This application cannot be changed in its current state.",
    STUDY_SESSION_NOT_FOUND: "No check-in code has been issued today.",
    STUDY_ATTENDANCE_CODE_INVALID: "That check-in code is not right.",
    STUDY_ATTENDANCE_ALREADY_MARKED: "You have already checked in today.",
    POINT_INSUFFICIENT_BALANCE: "You do not have enough points.",
    COUPON_CODE_NOT_FOUND: "That coupon code does not exist.",
    COUPON_CODE_ALREADY_USED: "That coupon code has already been used.",
    ISSUED_COUPON_ALREADY_USED: "One of the coupons has already been used.",
    INVALID_ISSUED_COUPON_INCLUDED: "One of the coupons cannot be used.",
    PAYMENT_ALREADY_COMPLETED: "Your dues are already paid.",
  },
} as const;
