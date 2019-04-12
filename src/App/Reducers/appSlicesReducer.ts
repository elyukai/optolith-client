import { WikiModel } from "../Models/Wiki/WikiModel";
import { combineReducerRecord } from "../Utilities/combineReducerRecord";
import { AppState } from "./appReducer";
import { HeroesState, herolistReducer } from "./herolistReducer";
import { isReadyReducer } from "./isReadyReducer";
import { localeReducer, LocaleState } from "./localeReducer";
import { uiReducer } from "./uiReducer";
import { wikiReducer } from "./wikiReducer";

export const appSlicesReducer =
  combineReducerRecord<AppState> ({
                                   herolist: HeroesState.default,
                                   l10n: LocaleState.default,
                                   ui: uiReducer.default,
                                   wiki: WikiModel.default,
                                   isReady: false,
                                 })
                                 ({
                                   herolist: herolistReducer,
                                   l10n: localeReducer,
                                   ui: uiReducer,
                                   wiki: wikiReducer,
                                   isReady: isReadyReducer,
                                 })
