interface Translation {
  home: HomeTranslations;
  login: LoginTranslations;
  general: GeneralTranslations;
  errors: ErrorTranslations;
  books: BooksTranslations;
  games: GamesTranslations;
  diary: DiaryTranslations;
  profile: ProfileTranslations;
  settings: SettingsTranslations;
  bookSubjects: {
    [key in keyof typeof InternetArchiveBookSubject]?: string;
  };
}

interface GeneralTranslations {
  onlineFeaturesDisclaimer: string;
  daysOfWeek: DaysOfWeekTranslations;
}

interface HomeTranslations {
  books: string;
  games: string;
  diary: string;
  profile: string;
}

interface BooksTranslations {
  donwloadingContent: string;
  noAuthor: string;
}

interface GamesTranslations {
  won: string;
  score: string;
}

interface DiaryTranslations {
  add: string;
  save: string;
  title: string;
  content: string;
  today: string;
  addDiaryEntryHeader: string;
  updateDiaryEntryHeader: string;
}

interface ProfileTranslations {
  settings: string;
  calendar: string;
  streak: string;
  weeklyProgress: string;
}

interface SettingsTranslations {
  general: string;
  onlineFeatures: string;
  language: string;
  laguageEng: string;
  languageSpa: string;
  bookReader: string;
  textSize: string;
  textSizeSmall: string;
  textSizeMedium: string;
  textSizeBig: string;
  textFont: string;
  textFontSerif: string;
  textFontOpenDyslexic: string;
  preferences: string;
  firstDayOfWeek: string;
}

interface DaysOfWeekTranslations {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface LoginTranslations {
  loginTitle: string;
  googleSignIn: string;
  continueWithoutOnlineFeatures: string;
}

interface ErrorTranslations {
  genericNetworkError: string;
}
