import { empty } from "../../Data/Queue"
import { fromDefault, Record } from "../../Data/Record"
import { AlertsState } from "../Reducers/alertsReducer"
import { TabId } from "../Utilities/LocationUtils"
import { FiltersState } from "./FiltersState"
import { SubWindowsState } from "./SubWindowsState"
import { UISettingsState } from "./UISettingsState"
import { UIWikiState } from "./UIWikiState"

export interface UIState {
  "@@name": "UIState"
  alerts: AlertsState
  filters: Record<FiltersState>
  location: TabId
  settings: Record<UISettingsState>
  subwindows: Record<SubWindowsState>
  wiki: Record<UIWikiState>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UIState =
  fromDefault ("UIState")
              <UIState> ({
                alerts: empty,
                filters: FiltersState.default,
                location: TabId.Herolist,
                settings: UISettingsState.default,
                subwindows: SubWindowsState.default,
                wiki: UIWikiState.default,
              })
