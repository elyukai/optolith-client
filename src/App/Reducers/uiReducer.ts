import { UIState } from "../Models/UIState"
import { combineReducerRecord } from "../Utilities/combineReducerRecord"
import { alertsReducer as alerts } from "./alertsReducer"
import { filtersReducer as filters } from "./filtersReducer"
import { routeReducer as location } from "./routeReducer"
import { subwindowsReducer as subwindows } from "./subwindowsReducer"
import { uiSettingsReducer as settings } from "./uiSettingsReducer"
import { wikiUIReducer as wiki } from "./wikiUIReducer"

export const uiReducer = combineReducerRecord (UIState)
                                              ({
                                                alerts,
                                                filters,
                                                location,
                                                settings,
                                                subwindows,
                                                wiki,
                                              })
