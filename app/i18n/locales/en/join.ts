export const join = {
  metaTitle: "Join the club",
  steps: {
    progressLabel: "Sign-up progress",
    agreement: "Club rules",
    "personal-info": "Your details",
    survey: "Short survey",
    chat: "Group chats",
    payment: "Membership fee",
  },

  actions: {
    next: "Next",
    back: "Back",
    agreeAndContinue: "Agree and continue",
    submitFailed: "We couldn't save this. Please try again in a moment.",
  },

  regulation: {
    translationNotice:
      "This is a courtesy translation of the club rules. If the two versions differ, the original Korean text governs.",
    articleLabel: "Article {{number}} — {{title}}",
    consent: {
      requiredTag: "[Required]",
      regulations: " I agree to the Aegis club rules",
      privacy: " I consent to the collection and use of my personal data",
    },
    chapters: {
      general: {
        title: "Chapter 1 — General provisions",
        articles: {
          "1": {
            title: "Name",
            content: 'This organization is named Aegis (hereafter "the Club").',
          },
          "2": {
            title: "Purpose",
            content:
              "As an academic club, the Club exists to advance every member's skills in security and software development.",
          },
        },
      },
      membership: {
        title: "Chapter 2 — Members",
        articles: {
          "3": {
            title: "Definition of a member",
            content:
              "Anyone who pays the membership fee and tells the Club they wish to join becomes a member.",
          },
          "4": {
            title: "Rights of members",
            content: [
              "All members have equal rights and may take part in every Club activity.",
              "All members may freely express their opinions for the good of the Club.",
              "No member may be discriminated against on the basis of gender, nationality, race, region, age, social status, level of knowledge, appearance, disability, or illness.",
              "All members may enter the club room.",
            ],
          },
          "5": {
            title: "Duties of members",
            content: [
              "All members must comply with the laws of the Republic of Korea, the regulations of Dankook University, the rules of the Dankook University Club Union, these Club rules, the Club guidelines, and any resolution passed by the officers' meeting.",
              "All members must treat one another with consideration and respect.",
              "All members must take an active part in the Club's activities.",
            ],
          },
          "6": {
            title: "Withdrawal and refund of the fee",
            content:
              "If a member who has paid the fee has taken part in no Club activity and notifies the officers of their withdrawal within seven days, the fee is refunded.",
          },
        },
      },
      operating: {
        title: "Chapter 3 — Officers",
        articles: {
          "7": {
            title: "Definition of the officers",
            content:
              "The body that represents and runs the Club is called the officers.",
          },
          "8": {
            title: "Composition and roles of the officers",
            content: [
              "The officers consist of the president, the vice president, and the committee members.",
              "The president represents the Club and the officers, and puts matters to a vote at the officers' meeting.",
              "The vice president acts for the president when that office is vacant.",
              "The types and responsibilities of committee members are decided at the officers' meeting.",
            ],
          },
          "9": {
            title: "Election of the officers",
            content: [
              "The next semester's president is elected at the officers' meeting; all other officers are chosen by that incoming president.",
              "If both the president and the vice president are absent from office, an acting officer is elected at the officers' meeting.",
            ],
          },
          "10": {
            title: "Rights of the officers",
            content: [
              "The officers may decide on and carry out the Club's activities on its behalf.",
              "Where it is needed to run the Club smoothly, the officers may amend these rules by resolution of the officers' meeting.",
            ],
          },
          "11": {
            title: "Duties of the officers",
            content: [
              "The officers must comply with the duties of members set out in Article 5.",
              "The officers must run the Club in line with the purpose set out in Article 2.",
              "The officers must manage the membership fees and any other income transparently.",
              "The officers must publish the Club's accounts at the end of each semester.",
            ],
          },
        },
      },
      disciplinary: {
        title: "Chapter 4 — Discipline",
        articles: {
          "12": {
            title: "Grounds for discipline",
            content:
              "Where a member breaches these rules, the officers may impose a disciplinary measure at their discretion.",
          },
          "13": {
            title: "Types of discipline",
            content:
              "The available measures are a warning, removal, and permanent removal. A member who receives a warning may have their activities restricted at the officers' discretion.",
          },
        },
      },
      accounting: {
        title: "Chapter 5 — Accounts",
        articles: {
          "14": {
            title: "Financial year",
            content:
              "As a rule, the Club's financial year corresponds to one semester.",
          },
          "15": {
            title: "Membership fee",
            content:
              "The Club's membership fee is 15,000 KRW, and may be discounted or waived depending on a member's record of activity.",
          },
        },
      },
      privacy: {
        title: "Chapter 6 — Personal data",
        articles: {
          "16": {
            title: "Use of personal data",
            content:
              "Personal data submitted when joining the Club may be used to run the Club, and the officers must make every effort to protect it.",
          },
        },
      },
    },
  },

  personalInfo: {
    phoneLabel: "Phone number",
    phonePlaceholder: "010-1234-5678",
    studentIdLabel: "Student ID",
    studentIdPlaceholder: "32000000",
    residentNumberBackLabel:
      "First digit of the second part of your resident registration number",
    residentNumberLabel: "Resident registration number",
    birthDatePlaceholder: "Birth date (YYMMDD)",
    departmentLabel: "Department",
    departmentSearchPlaceholder: "Search for your department",
    departmentEmpty: "No matching department.",
    gradeLabel: "Year",
    gradePlaceholder: "Select your year",
    grades: {
      ONE: "1st year",
      TWO: "2nd year",
      THREE: "3rd year",
      FOUR: "4th year",
      FIVE: "5th year",
    },
    validation: {
      birthDateLength: "Enter your birth date as 6 digits (YYMMDD)",
      birthDateInvalid: "That birth date is not valid (month 1-12, day 1-31)",
      genderDigit: "This digit must be a number from 1 to 8.",
      studentIdLength: "Your student ID must be 8 digits",
      studentIdFormat: "Your student ID must be 8 digits starting with 32",
      phoneRequired: "Please enter your phone number",
      phoneFormat: "That phone number format is not valid",
      departmentRequired: "Please select your department",
      gradeRequired: "Please select your year",
    },
  },

  survey: {
    acquisitionLabel: "How did you hear about us?",
    acquisitionTypes: {
      INSTAGRAM: "Instagram",
      EVERYTIME: "Everytime",
      FRIEND: "A friend",
      CLUB_FAIR: "Club fair",
      OFFLINE_EVENT: "In-person event",
      ETC: "Other",
    },
    joinReasonLabel: "Why do you want to join?",
    joinReasonPlaceholder:
      "What would you like to do in the club? Write as much or as little as you like.",
    validation: {
      joinReasonMin: "Please write at least 5 characters.",
      joinReasonMax: "Please keep this under 511 characters.",
      acquisitionRequired: "Please tell us how you heard about us",
    },
  },

  chat: {
    description: [
      "Announcements and day-to-day chat happen in our group chats.",
      "Please request to join both of the chats below.",
      "An organizer will approve you once they see the request.",
    ],
    noticeRoomTitle: "KakaoTalk announcements",
    noticeRoomDescription: "Key announcements and the activity schedule",
    communityRoomTitle: "KakaoTalk community chat",
    communityRoomDescription: "Chat freely with other members",
    opened: "Opened",
    statusAllJoined: "We have your requests for both chats",
    statusPending: "Request both chats to continue to the next step",
  },

  payment: {
    amountLabel: "Amount due",
    amountWithUnit: "{{amount}} KRW",
    couponDialogTitle: "Discount coupons",
    couponCount: "{{count}} available",
    couponFetchFailed: "Failed to load",
    couponLoadError: "We could not load your coupons.",
    waiting: {
      title: "Checking for your transfer",
      body: "Once the depositor name and amount match, your payment is confirmed automatically. If it is still not confirmed after a while, please get in touch through the transfer questions below.",
    },
    paid: {
      label: "Paid",
      title: "Your transfer is confirmed and you're now a member.",
      body: "Next, we'll show you where to go from here.",
    },
    loadError: "We could not load your payment status. Please try again later.",
    account: {
      sectionLabel: "Bank transfer details",
      accountNumber: "Account",
      accountHolder: "Account holder",
      depositorName: "Depositor name",
      copyAccount: "Copy account number",
      copySuccess: "Account number copied.",
      copyFailure: "Could not copy. Please check your browser permissions.",
    },
    inquiry: {
      title: "Questions about your transfer",
      kakaoLabel: "KakaoTalk",
      hint: "Please include your name and department when you get in touch.",
    },
  },

  coupon: {
    codeInputLabel: "Coupon code",
    codeInputPlaceholder: "Enter a coupon code",
    register: "Add",
    empty: "You have no coupons available.",
    listLegend: "Available coupons",
    applySelected: "Apply selected coupons",
    discountAmount: "{{amount}} KRW off",
    registerSuccess: "Coupon added.",
  },

  complete: {
    title: "You're in",
    noticeLead: "An officer will accept your requests to join the ",
    noticeStrong: "KakaoTalk group chats",
    noticeTail:
      " once they have checked them. In the meantime, start with the list below.",
    tasksLabel: "What to do next",
    tasks: {
      study: {
        title: "Join a study",
        description: "Look through this term's studies and apply to one.",
      },
      mypage: {
        title: "Check My page",
        description:
          "See your activity points, coupons and attendance QR on My page.",
      },
      instagram: {
        title: "Follow our news",
        description: "Keep up with Aegis activities and news on Instagram.",
      },
      github: {
        title: "Explore our GitHub",
        description:
          "Browse the code of the services Aegis built itself, from this join page to studies and My page.",
      },
    },
    chatReminder: "Missed a chat request?",
  },
} as const;
