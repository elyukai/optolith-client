import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as HerolistActions from '../actions/HerolistActions';
import * as HistoryActions from '../actions/HistoryActions';
import * as InGameActions from '../actions/InGameActions';
import * as LocaleActions from '../actions/LocaleActions';
import * as LocationActions from '../actions/LocationActions';
import * as PlatformActions from '../actions/PlatformActions';
import { AppState } from '../reducers/app';
import { getRedoAvailability, getUndoAvailability } from '../selectors/currentHeroSelectors';
import { getCurrentHeroPresent, getLocaleId, getLocaleType } from '../selectors/stateSelectors';
import { getCurrentSection, getCurrentTab } from '../selectors/uilocationSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from '../views/navigationbar/NavigationBar';

function mapStateToProps(state: AppState) {
	return {
		currentSection: getCurrentSection(state),
		currentTab: getCurrentTab(state),
		hero: getCurrentHeroPresent(state),
		isRedoAvailable: getRedoAvailability(state),
		isUndoAvailable: getUndoAvailability(state),
		localeString: getLocaleId(state),
		localeType: getLocaleType(state),
		theme: getTheme(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setSection(id: 'main' | 'hero' | 'group') {
			dispatch(LocationActions._setSection(id));
		},
		setTab(id: string) {
			dispatch(LocationActions._setTab(id));
		},
		setTheme(theme: string) {
			dispatch(ConfigActions.setTheme(theme));
		},
		undo() {
			dispatch(HistoryActions.undo());
		},
		redo() {
			dispatch(HistoryActions.redo());
		},
		saveConfig() {
			dispatch(PlatformActions.requestConfigSave());
		},
		saveHero() {
			dispatch(HerolistActions._saveHero());
		},
		saveGroup() {
			dispatch(InGameActions._save());
		},
		setLocale(id?: string) {
			dispatch(LocaleActions._setLocale(id));
		}
	};
}

export const NavigationBarContainer = connect<NavigationBarStateProps, NavigationBarDispatchProps, NavigationBarOwnProps>(mapStateToProps, mapDispatchToProps)(NavigationBar);
