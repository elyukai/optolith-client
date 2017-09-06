import { remote } from 'electron';
import { connect, Dispatch } from 'react-redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as HerolistActions from '../actions/HerolistActions';
import * as HistoryActions from '../actions/HistoryActions';
import * as InGameActions from '../actions/InGameActions';
import * as LocaleActions from '../actions/LocaleActions';
import * as LocationActions from '../actions/LocationActions';
import * as PlatformActions from '../actions/PlatformActions';
import { AppState } from '../reducers/app';
import { getRedoAvailability, getUndoAvailability } from '../selectors/currentHeroSelectors';
import { getMessages } from '../selectors/localeSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../stores/AppStore';
import { alert } from '../utils/alert';
import { confirm } from '../utils/confirm';
import { _translate } from '../utils/I18n';
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from '../views/App';

function mapStateToProps(state: AppState) {
	const { currentHero: { present }, locale, ui: { location: { section, tab }} } = state;
	return {
		isRedoAvailable: getRedoAvailability(state),
		isUndoAvailable: getUndoAvailability(state),
		theme: getTheme(state),
		hero: present,
		locale: locale.messages,
		localeString: locale.id,
		localeType: locale.type,
		platform: remote.process.platform,
		section,
		tab
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
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
		},
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
