import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as IOActions from '../actions/IOActions';
import * as LocaleActions from '../actions/LocaleActions';
import { AppState } from '../reducers/app';
import { getLocaleId, getLocaleType } from '../selectors/stateSelectors';
import { areAnimationsEnabled, getTheme, isEditingHeroAfterCreationPhaseEnabled } from '../selectors/uisettingsSelectors';
import { Settings, SettingsDispatchProps, SettingsOwnProps, SettingsStateProps } from '../views/navigationbar/Settings';

function mapStateToProps(state: AppState) {
	return {
		localeString: getLocaleId(state),
		localeType: getLocaleType(state),
		isEditingHeroAfterCreationPhaseEnabled: isEditingHeroAfterCreationPhaseEnabled(state),
		areAnimationsEnabled: areAnimationsEnabled(state),
		theme: getTheme(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setTheme(theme: string) {
			dispatch<any>(ConfigActions.setTheme(theme));
		},
		switchEnableEditingHeroAfterCreationPhase() {
			dispatch<any>(ConfigActions.switchEnableEditingHeroAfterCreationPhase());
		},
		saveConfig() {
			dispatch<any>(IOActions.requestConfigSave());
		},
		setLocale(id?: string) {
			dispatch<any>(LocaleActions._setLocale(id));
		},
		switchEnableAnimations() {
			dispatch<any>(ConfigActions.switchEnableAnimations());
		},
	};
}

export const SettingsContainer = connect<SettingsStateProps, SettingsDispatchProps, SettingsOwnProps>(mapStateToProps, mapDispatchToProps)(Settings);
