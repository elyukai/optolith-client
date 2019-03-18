import { Action } from "redux";
import { Record } from "../../Data/Record";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { combineReducerRecord } from "../Utilities/combineReducerRecord";
import { reduceReducers } from "../Utilities/reduceReducers";
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

const appSlices =
  combineReducerRecord<AppState> ({
                                   herolist: HeroesState.default,
                                   l10n: LocaleState.default,
                                   ui,
                                   wiki: WikiModel.default,
                                 })
                                 ({
                                   herolist,
                                   l10n,
                                   ui,
                                   wiki,
                                 })

export const appReducer = reduceReducers<AppState, Action> (appSlices, appPostReducer)
