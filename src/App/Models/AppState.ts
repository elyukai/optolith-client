import { PresavedCache } from "./Cache"
import { HeroesState } from "./HeroesState"
import { LocaleState } from "./LocaleState"
import { UIState } from "./UIState"
import { StaticData } from "./Wiki/WikiModel"

export interface AppState {
  herolist: HeroesState
  l10n: LocaleState
  ui: UIState
  wiki: StaticData
  isLoading: boolean
  hasInitWithError: boolean
  cache: PresavedCache
}
