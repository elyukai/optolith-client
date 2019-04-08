import { AnyAction } from "redux";
import { Record } from "../../Data/Record";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { combineReducerRecord } from "../Utilities/combineReducerRecord";
import { reduceReducersC } from "../Utilities/reduceReducers";
import { appPostReducer } from "./appPostReducer";
import { HeroesState, herolistReducer as herolist } from "./herolistReducer";
import { localeReducer as l10n, LocaleState } from "./localeReducer";
import { uiReducer as ui, UIState } from "./uiReducer";
import { wikiReducer as wiki } from "./wikiReducer";

export interface AppState {
  herolist: Record<HeroesState>
  l10n: Record<LocaleState>
  ui: Record<UIState>
  wiki: WikiModelRecord
}

export type AppStateRecord = Record<AppState>

const appSlices =
  combineReducerRecord<AppState> ({
                                   herolist: HeroesState.default,
                                   l10n: LocaleState.default,
                                   ui: ui.default,
                                   wiki: WikiModel.default,
                                 })
                                 ({
                                   herolist,
                                   l10n,
                                   ui,
                                   wiki,
                                 })

export const AppState = {
  default: appSlices.default,
  A: appSlices.A,
  A_: appSlices.A_,
  L: appSlices.L,
}

export const appReducer = reduceReducersC<Record<AppState>, AnyAction> (appSlices, appPostReducer)
