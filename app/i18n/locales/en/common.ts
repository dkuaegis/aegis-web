export const common = {
  languageToggleLabel: "Language",
  address: "Room 530, Hyedang Hall, Dankook University (Jukjeon Campus)",

  loading: "Loading...",
  retry: "Try again",
  close: "Close",
  cancel: "Cancel",

  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainMenu: "Main menu",
  mobileMainMenu: "Mobile main menu",

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
} as const;
