import { combineReducers } from 'redux';
import { uilocation as location, UILocationState } from './uilocation';
import { uisettings as settings, UISettingsState } from './uisettings';

export interface UIState {
	location: UILocationState;
	settings: UISettingsState;
}

export const ui = combineReducers({
	location,
	settings
});
