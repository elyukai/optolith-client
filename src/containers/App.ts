import { remote } from 'electron';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as LocationActions from '../actions/LocationActions';
import * as PlatformActions from '../actions/PlatformActions';
import { AppState } from '../reducers/app';
import { getUndoAvailability } from '../selectors/currentHeroSelectors';
import { getMessages } from '../selectors/localeSelectors';
import { getCurrentTab } from '../selectors/uilocationSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { alert } from '../utils/alert';
import { confirm } from '../utils/confirm';
import { _translate } from '../utils/I18n';
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from '../views/App';

function mapStateToProps(state: AppState) {
	return {
		currentTab: getCurrentTab(state),
		locale: getMessages(state),
		theme: getTheme(state),
		platform: remote.process.platform
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		minimize() {
			remote.getCurrentWindow().minimize();
		},
		maximize() {
			remote.getCurrentWindow().maximize();
		},
		restore() {
			remote.getCurrentWindow().unmaximize();
		},
		close() {
			dispatch(((dispatch, getState) => {
				const state = getState();
				const safeToExit = !getUndoAvailability(state);
				const locale = getMessages(state);
				if (locale) {
					if (safeToExit) {
						dispatch(PlatformActions.requestSaveAll());
						alert(_translate(locale, 'fileapi.allsaved'), () => {
							remote.getCurrentWindow().close();
						});
					}
					else {
						confirm(_translate(locale, 'heroes.warnings.unsavedactions.title'), _translate(locale, 'heroes.warnings.unsavedactions.text'), true).then(result => {
							if (result === true) {
								dispatch(PlatformActions.requestSaveAll());
								alert(_translate(locale, 'fileapi.everythingelsesaved'), () => {
									remote.getCurrentWindow().close();
								});
							}
							else {
								dispatch(LocationActions._setSection('hero'));
							}
						});
					}
				}
			}) as AsyncAction);
		}
	};
}

export const AppContainer = connect<AppStateProps, AppDispatchProps, AppOwnProps>(mapStateToProps, mapDispatchToProps)(App);
