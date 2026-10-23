/**
 * The app theme.
 */
export enum Theme {
  Light,
  Dark,
}

/**
 * The global settings.
 */
export type GlobalSettings = {
  locale: string
  fallbackLocale: string | undefined
  theme: Theme | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
}
