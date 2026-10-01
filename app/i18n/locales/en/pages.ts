export const pages = {
  faq: {
    meta: { title: "FAQ - Aegis", description: "Aegis frequently asked questions" },
    title: "Frequently asked questions",
    subtitle: "Here is what people usually want to know before they join.",
    items: {
      about: {
        question: "What kind of club is Aegis?",
        answer:
          "Aegis is Dankook University's leading development and security club, open to everyone who wants to grow.",
      },
      eligibility: {
        question: "Who can apply?",
        answer:
          "Any Dankook University student — new, current, or on leave. Your year and major do not matter; if you are interested in security or development, you are welcome!",
      },
      skill: {
        question: "Do I need to be good already?",
        answer:
          "Not at all. If you are motivated and willing to learn, you can apply. Growing together is the whole point of the club.",
      },
      activities: {
        question: "What do members do?",
        answer:
          "Regular study groups, project work, CTF competitions, security seminars, hackathons, and more. Members also mentor each other across years.",
      },
      fee: {
        question: "Is there a membership fee?",
        answer:
          "Yes, 15,000 KRW. It goes toward running the club and its activities. Former club officers are exempt — just get in touch.",
      },
      room: {
        question: "Where is the club room?",
        answer: "Room 530, Hyedang Hall (the Woori Bank building).",
      },
      more: {
        question: "I have another question",
        answer:
          "Email dankook.aegis@gmail.com or message @dku_aegis on Instagram any time. We are happy to help!",
      },
    },
  },

  recruit: {
    meta: {
      title: "How to join - Aegis",
      description: "Aegis new member recruitment",
    },
    title: "How to join",
    subtitle: "We are looking for new members to build with.",
    cta: "Join us",
    notice: {
      targetIconAlt: "Profile",
      targetLabel: "Who can apply:",
      targetValue:
        " Dankook University students — new, current, or on leave",
      targetSub:
        "Your year and major do not matter. If you are interested in security or development, you are welcome!",
      emailIconAlt: "Email",
      emailBody:
        "If anything goes wrong while you are signing up, reach out using the contact details on the Contact page.",
      securityIconAlt: "Security",
      securityLead: "If you hit a ",
      securityStrong: "403 error",
      securityTail:
        " during Google sign-in, copy the link and open it in Chrome or Safari.",
      securitySub:
        "Google's security policy blocks sign-in inside in-app browsers.",
      feeIconAlt: "Payment",
      feeLead: "The membership fee is ",
      feeStrong: "15,000 KRW",
      feeTail: ".",
      feeSub:
        "Former club officers are exempt — please reach out using the contact details on the Contact page.",
    },
  },

  contact: {
    meta: { title: "Contact - Aegis", description: "Contact Aegis" },
    title: "Contact",
    subtitle:
      "Have another question, or want to sponsor us? Get in touch any time.",
    presidentLabel: "President",
    copyPhone: "Copy phone number",
  },

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
