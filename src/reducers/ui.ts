import { combineReducers } from 'redux';
import { alerts, AlertsState } from './alerts';
import { filtersReducer as filters, FiltersState } from './filtersReducer';
import { subwindows, SubWindowsState } from './subwindowsReducer';
import { uilocation as location, UILocationState } from './uilocation';
import { uisettings as settings, UISettingsState } from './uisettings';
import { uiWiki as wiki, UIWikiState } from './uiWiki';

export interface UIState {
	alerts: AlertsState;
	filters: FiltersState;
	location: UILocationState;
	settings: UISettingsState;
	subwindows: SubWindowsState;
	wiki: UIWikiState;
}

export const ui = combineReducers<UIState>({
	alerts,
	filters,
	location,
	settings,
	subwindows,
	wiki
});
