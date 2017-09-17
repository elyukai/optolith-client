import { combineReducers } from 'redux';
import { uilocation as location, UILocationState } from './uilocation';
import { uisettings as settings, UISettingsState } from './uisettings';
import { uiWiki as wiki, UIWikiState } from './uiWiki';

export interface UIState {
	location: UILocationState;
	settings: UISettingsState;
	wiki: UIWikiState;
}

export const ui = combineReducers({
	location,
	settings,
	wiki
});
