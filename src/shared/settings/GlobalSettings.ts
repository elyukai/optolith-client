import { Theme } from "../schema/config.ts"

export type GlobalSettings = {
  locale: string | undefined
  fallbackLocale: string | undefined
  theme: Theme | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
}
