export const study = {

  loading: {
    general: "Loading...",
    role: "Checking your permissions...",
    study: "Loading the study...",
    members: "Loading members...",
    applicants: "Loading applicants...",
    attendance: "Loading attendance...",
    application: "Loading the application...",
    applicationShort: "Loading...",
  },


  forbidden: {
    default: "You do not have permission to view this.",
    edit: "You do not have permission to edit this study.",
    members: "You do not have permission to manage this study's members.",
    attendance: "You do not have permission to manage this study's attendance.",
    applications: "You do not have permission to view this study's applications.",
  },

  invalidStudyId: "That study ID is not valid.",

  labels: {
    categories: {
      LANGUAGE: "Languages",
      WEB: "Web",
      APPLICATION: "Apps",
      GAME: "Games",
      SECURITY: "Security",
      COMPUTER_SCIENCE: "CS",
      ARTIFICIAL_INTELLIGENCE: "AI",
      DATA_SCIENCE: "Data",
      ETC: "Other",
    },
    levels: {
      BASIC: "Beginner",
      EASY: "Easy",
      INTERMEDIATE: "Intermediate",
      ADVANCED: "Advanced",
    },
    recruitmentMethods: {
      FCFS: "First come",
      APPLICATION: "Application",
    },
  },

  list: {
    participants: "{{current}}/{{max}}",
    loadError: "We could not load the list of studies.",
  },

  detail: {
    notFound: "We could not find that study.",
    genericError: "Something went wrong.",
    about: "About this study",
    curriculum: "Curriculum",
    qualifications: "Who can join",
    instructor: "Leader",
    schedule: "Schedule",
    ownerActions: {
      attendance: "Attendance",
    },
    badges: {
      participating: "Joined",
    },
    attendance: {
      label: "Attendance code",
      placeholder: "4 digits",
      submit: "Submit",
      submitting: "Submitting...",
      invalidLength: "Please enter the 4-digit attendance code.",
      success: "You're marked present!",
      failure: "Something went wrong while recording your attendance.",
    },
  },

  application: {
    statusMessage: {
      approved: "You're part of this study!",
      rejected: "Your application was not accepted.",
      rejectedSub: "Have a look at the other studies.",
      pending: "Your application is being reviewed.",
    },
    form: {
      processing: "Working...",
      dialogTitle: "Your application",
      dialogDescription: "Tell the leader why you want to join.",
      placeholder:
        "Why do you want to join this study, and what do you hope to get out of it? Write freely.",
      submit: "Submit",
      editDialogTitle: "Edit your application",
      editDialogDescription:
        "Your current application is loaded below — edit it as you like.",
      editSubmit: "Save changes",
      editSubmitting: "Saving...",
    },
    fcfs: {
      confirmTitle: "Confirm your request",
      confirmDescription: "Are you sure you want to join?",
      confirmSubmit: "Join",
    },
    toast: {
      appliedFcfs: "You're in — welcome to the study!",
      appliedForm:
        "Your application is in. We'll let you know once it's been reviewed.",
      applyFailed: "Something went wrong. Please try again.",
      updated: "Your application has been updated.",
      updateFailed:
        "Something went wrong while saving your application. Please try again.",
      reasonRequired: "Please say why you want to join.",
      detailLoadFailed: "We could not load your application.",
    },
  },

  form: {
    titleLabel: "Study name",
    titleRequired: "Please name your study.",
    titleMaxLength: "Keep the name to {{max}} characters or fewer.",
    categoryLabel: "Category",
    categoryPlaceholder: "Pick a category",
    categoryRequired: "Please pick a category.",
    difficultyLabel: "Level",
    difficultyPlaceholder: "Pick a level",
    difficultyRequired: "Please pick a level.",
    introductionRequired: "Please describe your study.",
    introductionMaxLength:
      "Keep the description to {{max}} characters or fewer.",

    participantsRange: "Enter a number between 1 and 50.",

    scheduleMaxLength: "Keep the schedule to {{max}} characters or fewer",

    curriculumSection: "Curriculum",
    curriculumRequired: "Please fill in this curriculum item.",
    curriculumAtLeastOne: "Add at least one curriculum item.",
    requirementsSection: "Who can join",
    requirementsRequired: "Please fill in this requirement.",
    requirementsAtLeastOne: "Add at least one requirement.",

    createSubmitting: "Creating...",
    createConfirmTitle: "Create this study?",
    createConfirmDescription: "Are you sure you want to create it?",
    createSuccess: "Your study is live!",
    createError: "Something went wrong while creating the study.",

    editSubmit: "Save changes",
    editSubmitting: "Saving...",
    editConfirmTitle: "Save these changes?",
    editConfirmDescription: "Are you sure you want to save?",
    editSuccess: "Your study has been updated!",
    editError: "Something went wrong while saving the study.",
    editLoadError: "We could not load this study.",
    editModeCallbackMissing: "Edit mode requires an onComplete callback.",
  },

  members: {
    phoneCopied: "Phone number copied",
    loadError: "We could not load the member list.",
  },

  applications: {
    fcfsTitle: "This study is first come, first served.",
    fcfsSubtitle: "There are no applications to review.",
    noApplicants: "No one has applied to this study yet.",
    filters: {
      all: "All",
      pending: "Under review",
      approved: "Approved",
      rejected: "Rejected",
    },
    card: {
      statusPending: "Under review",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      statusUnknown: "Unknown",
      viewApplication: "Read application",
      dialogTitle: "{{name}}'s application",
      loadFailed: "We could not load this application.",
      approve: "Approve",
      reject: "Reject",
      approveError: "Something went wrong while approving the application.",
      rejectError: "Something went wrong while rejecting the application.",
      statusChangeError:
        "Something went wrong while changing the application status.",
      listError: "Something went wrong while loading the applicants.",
      studyLoadError: "Something went wrong while loading the study.",
    },
  },

  attendance: {
    sessionColumn: "Session {{index}}",
    noData: "No attendance data yet.",
    loadError: "We could not load the attendance data.",
    generating: "Generating...",
    generateShort: "Generate",
    generateConfirmTitle: "Generate a code?",
    generateConfirmDescription:
      "Are you sure? A generated attendance code is only valid on the day it was created.",
    codeError: "We could not generate an attendance code.",
  },

  errors: {
    notInstructor: "You are not the leader of this study.",
    notMember: "You are not a member of this study.",
    studyNotFound: "We could not find that study.",
    applicationNotFound: "We could not find that application.",
    badRequestData: "Some of the submitted data was not valid.",
    badRequest: "That request was not valid.",
    applicationsFetch: "Something went wrong while loading the applicants.",
    applicationFetch: "Something went wrong while loading the application.",
    applicationStatusUpdate:
      "Something went wrong while changing the application status.",
    applicationApprove: "Something went wrong while approving the application.",
    applicationReject: "Something went wrong while rejecting the application.",
    invalidAttendanceCode: "That attendance code is not correct.",
    noSessionToday: "There is no session running today.",
    alreadyAttended: "Your attendance is already recorded.",
    attendanceSubmit: "Something went wrong while recording attendance.",
    attendanceCodeIssue: "Something went wrong while generating the code.",
    attendanceFetch: "Something went wrong while loading attendance.",
    studyUpdate: "Something went wrong while saving the study.",
    notRecruitmentPeriod: "This study is not accepting applications right now.",
    alreadyApplied: "You have already applied.",
    enrollmentApply: "Something went wrong while submitting your request.",
    enrollmentCancel: "Something went wrong while cancelling your request.",
    applicationLookup: "Something went wrong while looking up the application.",
    applicationUpdate: "Something went wrong while saving the application.",
    membersFetch: "We could not load the member list.",
    applySuccess: "Your request has been submitted.",
    statusLookup: "Something went wrong while checking the study status",
  },
} as const;
