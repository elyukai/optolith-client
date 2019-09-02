import { AnyAction } from "redux";
import { Record } from "../../Data/Record";
import { WikiModelRecord } from "../Models/Wiki/WikiModel";
import { reduceReducersCWithInter } from "../Utilities/reduceReducers";
import { appPostReducer } from "./appPostReducer";
import { appSlicesReducer } from "./appSlicesReducer";
import { HeroesState } from "./herolistReducer";
import { LocaleState } from "./localeReducer";
import { UIState } from "./uiReducer";

export interface AppState {
  "@@name": "AppState"
  herolist: Record<HeroesState>
  l10n: Record<LocaleState>
  ui: Record<UIState>
  wiki: WikiModelRecord
  isReady: boolean
}

export type AppStateRecord = Record<AppState>

export const AppState = {
  default: appSlicesReducer.default,
  A: appSlicesReducer.A,
  A_: appSlicesReducer.A_,
  L: appSlicesReducer.L,
}

export const appReducer =
  reduceReducersCWithInter<Record<AppState>, AnyAction> (appSlicesReducer, appPostReducer)
