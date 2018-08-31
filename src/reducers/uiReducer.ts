import { combineReducers } from 'redux';
import { alertsReducer as alerts, AlertsState } from './alertsReducer';
import { filtersReducer as filters, FiltersState } from './filtersReducer';
import { routeReducer as location, UILocationState } from './routeReducer';
import { subwindowsReducer as subwindows, SubWindowsState } from './subwindowsReducer';
import { uiSettingsReducer as settings, UISettingsState } from './uiSettingsReducer';
import { UIWikiState, wikiUIReducer as wiki } from './wikiUIReducer';

export interface UIState {
  alerts: AlertsState;
  filters: FiltersState;
  location: UILocationState;
  settings: UISettingsState;
  subwindows: SubWindowsState;
  wiki: UIWikiState;
}

export const uiReducer = combineReducers<UIState> ({
  alerts,
  filters,
  location,
  settings,
  subwindows,
  wiki
});
