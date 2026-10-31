export const pages = {



  authContinue: {
    checking: "Checking your sign-in details...",
    failed: "We could not confirm whether you are signed in.",
    retry: "Try again",
  },

  browserRedirect: {
    title: "You are browsing inside {{browser}}",
    iosHint: "Please open this page in Safari",
    genericHint: "For everything to work properly, open this in a real browser",
    support: "If the problem continues, please contact the club organizers",
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
      kakaotalk:
        "Or long-press the link to copy it, then paste it into Safari",
    },
  },
} as const;
