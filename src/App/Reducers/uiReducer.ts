import { Record } from "../../Data/Record";
import { combineReducerRecord } from "../Utilities/combineReducerRecord";
import { TabId } from "../Utilities/LocationUtils";
import { alertsReducer as alerts, AlertsState, AlertsStateDefault } from "./alertsReducer";
import { filtersReducer as filters, FiltersState } from "./filtersReducer";
import { RouteDefault, routeReducer as location } from "./routeReducer";
import { subwindowsReducer as subwindows, SubWindowsState } from "./subwindowsReducer";
import { uiSettingsReducer as settings, UISettingsState } from "./uiSettingsReducer";
import { UIWikiState, wikiUIReducer as wiki } from "./wikiUIReducer";

export interface UIState {
  "@@name": "UIState"
  alerts: AlertsState
  filters: Record<FiltersState>
  location: TabId
  settings: Record<UISettingsState>
  subwindows: Record<SubWindowsState>
  wiki: Record<UIWikiState>
}

export const uiReducer = combineReducerRecord ("UIState")
                                              <UIState> ({
                                                          alerts: AlertsStateDefault,
                                                          filters: FiltersState.default,
                                                          location: RouteDefault,
                                                          settings: UISettingsState.default,
                                                          subwindows: SubWindowsState.default,
                                                          wiki: UIWikiState.default,
                                                        })
                                                        ({
                                                          alerts,
                                                          filters,
                                                          location,
                                                          settings,
                                                          subwindows,
                                                          wiki,
                                                        })
