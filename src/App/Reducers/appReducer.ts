import { AnyAction } from "redux";
import { Record } from "../../Data/Record";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { combineReducerRecord } from "../Utilities/combineReducerRecord";
import { reduceReducersCWithInter } from "../Utilities/reduceReducers";
import { appPostReducer } from "./appPostReducer";
import { HeroesState, herolistReducer as herolist } from "./herolistReducer";
import { isReadyReducer } from "./isReadyReducer";
import { localeReducer as l10n, LocaleState } from "./localeReducer";
import { uiReducer as ui, UIState } from "./uiReducer";
import { wikiReducer as wiki } from "./wikiReducer";

export interface AppState {
  herolist: Record<HeroesState>
  l10n: Record<LocaleState>
  ui: Record<UIState>
  wiki: WikiModelRecord
  isReady: boolean
}

export type AppStateRecord = Record<AppState>

const appSlices =
  combineReducerRecord<AppState> ({
                                   herolist: HeroesState.default,
                                   l10n: LocaleState.default,
                                   ui: ui.default,
                                   wiki: WikiModel.default,
                                   isReady: false,
                                 })
                                 ({
                                   herolist,
                                   l10n,
                                   ui,
                                   wiki,
                                   isReady: isReadyReducer,
                                 })

export const AppState = {
  default: appSlices.default,
  A: appSlices.A,
  A_: appSlices.A_,
  L: appSlices.L,
}

export const appReducer =
  reduceReducersCWithInter<Record<AppState>, AnyAction> (appSlices, appPostReducer)
