import { fromDefault, Record } from "../../Data/Record"
import { HeroesState } from "./HeroesState"
import { LocaleState } from "./LocaleState"
import { UIState } from "./UIState"
import { StaticData } from "./Wiki/WikiModel"

export interface AppState {
  "@@name": "AppState"
  herolist: Record<HeroesState>
  l10n: Record<LocaleState>
  ui: Record<UIState>
  wiki: Record<StaticData>
  isReady: number
}

export type AppStateRecord = Record<AppState>

export const AppState =
  fromDefault ("AppState")
              <AppState> ({
                herolist: HeroesState.default,
                l10n: LocaleState.default,
                ui: UIState.default,
                wiki: StaticData.default,
                isReady: 0,
              })
