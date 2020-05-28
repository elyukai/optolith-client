import { AlertsState } from "../Reducers/alertsReducer"
import { TabId } from "../Utilities/LocationUtils"
import { FiltersState } from "./FiltersState"
import { SubWindowsState } from "./SubWindowsState"
import { UISettingsState } from "./UISettingsState"
import { UIWikiState } from "./UIWikiState"

export interface UIState {
  alerts: AlertsState
  filters: FiltersState
  location: TabId
  settings: UISettingsState
  subwindows: SubWindowsState
  wiki: UIWikiState
}
