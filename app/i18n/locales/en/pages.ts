export const pages = {
  login: {
    metaTitle: "Log in",
    eyebrow: "Google sign-in",
    redirecting: "Taking you to Google sign-in.",
    manual: "Click here if nothing happens",
  },

  authContinue: {
    checking: "Checking your sign-in details...",
    failed: "We could not confirm whether you are signed in.",
    retry: "Try again",
  },

  notFound: {
    title: "We couldn't find that page.",
    home: "Go to the home page",
  },

  appError: {
    title: "Something went wrong while showing this page.",
    reload: "Reload",
  },

  browserRedirect: {
    title: "This page is open inside {{browser}}",
    copyLink: "Copy link",
    iosHint: "Sign-in and payment may not work here. Open the page in Safari.",
    genericHint:
      "Sign-in and payment may not work here. Open the page in your default browser.",
    support: "If it still will not open, let the club organizers know.",
    names: {
      inApp: "an in-app browser",
      kakaotalk: "KakaoTalk",
      instagram: "Instagram",
      everytime: "Everytime",
      naver: "Naver",
      facebook: "Facebook",
      line: "LINE",
      snapchat: "Snapchat",
      tiktok: "TikTok",
      whatsapp: "WhatsApp",
    },
    steps: {
      fallback: [
        "Tap the ⋯ or ⋮ button in the browser",
        'Choose "Open in external browser"',
      ],
      kakaotalk: [
        'Tap the "⋮" (more) button at the top of the chat',
        'Choose "Open in other browser"',
      ],
      instagram: [
        'Tap the "⋯" button at the top of the post',
        'Choose "Copy link"',
        "Open Safari and paste it into the address bar",
      ],
      naver: [
        'Tap the "⋮" or "⋯" button at the top',
        'Choose "Open in other browser"',
      ],
      facebook: [
        'Tap the "⋯" button at the top of the post',
        'Choose "Copy link"',
        "Open Safari and paste it into the address bar",
      ],
      line: [
        'Tap the "⋮" (more) button at the top of the chat',
        'Choose "Open in other browser"',
      ],
    },
    safariHint: {
      kakaotalk: "Or long-press the link to copy it, then paste it into Safari",
    },
  },
} as const;
