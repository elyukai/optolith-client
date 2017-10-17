import { combineReducers } from 'redux';
import { alerts, AlertsState } from './alerts';
import { uilocation as location, UILocationState } from './uilocation';
import { uisettings as settings, UISettingsState } from './uisettings';
import { uiWiki as wiki, UIWikiState } from './uiWiki';

export interface UIState {
	alerts: AlertsState;
	location: UILocationState;
	settings: UISettingsState;
	wiki: UIWikiState;
}

export const ui = combineReducers<UIState>({
	alerts,
	location,
	settings,
	wiki
});
