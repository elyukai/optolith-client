/**
 * The app theme.
 */
export type Theme = undefined | "light" | "dark"

/**
 * The global settings.
 */
export type GlobalSettings = {
  locale: string | undefined
  fallbackLocale: string | undefined
  theme: Theme | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
}
