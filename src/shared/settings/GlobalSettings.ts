export enum Theme {
  Light,
  Dark,
}

export type GlobalSettings = {
  locale: string | undefined
  fallbackLocale: string | undefined
  theme: Theme | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
}
