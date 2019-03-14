import { Action } from "redux";
import { Record } from "../../Data/Record";
import { L10nRecord } from "../Models/Wiki/L10n";
import { WikiModelRecord } from "../Models/Wiki/WikiModel";
import { combineReducerRecord } from "../Utils/combineReducerRecord";
import { reduceReducers } from "../Utils/reduceReducers";
import { appPostReducer } from "./appPostReducer";
import { herolistReducer as herolist, HerolistState } from "./herolistReducer";
import { uiReducer as ui, UIState } from "./uiReducer";
import { wikiReducer as wiki } from "./wikiReducer";

export interface AppState {
  herolist: Record<HerolistState>
  l10n: L10nRecord
  ui: Record<UIState>
  wiki: WikiModelRecord
}

const appSlices =
  combineReducerRecord<AppState> ({
                                   herolist,
                                   l10n,
                                   ui,
                                   wiki,
                                 })
                                 ({
                                   herolist,
                                   l10n,
                                   ui,
                                   wiki,
                                 })

export const appReducer = reduceReducers<AppState, Action> (appSlices, appPostReducer)
