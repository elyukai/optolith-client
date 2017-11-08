import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as HistoryActions from '../actions/HistoryActions';
import * as InGameActions from '../actions/InGameActions';
import * as LocationActions from '../actions/LocationActions';
import { AppState } from '../reducers/app';
import { getRedoAvailability, getUndoAvailability } from '../selectors/currentHeroSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getCurrentHeroPresent } from '../selectors/stateSelectors';
import { getCurrentSection, getCurrentTab } from '../selectors/uilocationSelectors';
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from '../views/navigationbar/NavigationBar';

function mapStateToProps(state: AppState) {
	return {
		currentSection: getCurrentSection(state),
		currentTab: getCurrentTab(state),
		hero: getCurrentHeroPresent(state),
		isRedoAvailable: getRedoAvailability(state),
		isUndoAvailable: getUndoAvailability(state),
		isRemovingEnabled: isRemovingEnabled(state),
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
		undo() {
			dispatch(HistoryActions.undo());
		},
		redo() {
			dispatch(HistoryActions.redo());
		},
		saveHero() {
			dispatch(HerolistActions._saveHero());
		},
		saveGroup() {
			dispatch(InGameActions._save());
		}
	};
}

export const NavigationBarContainer = connect<NavigationBarStateProps, NavigationBarDispatchProps, NavigationBarOwnProps>(mapStateToProps, mapDispatchToProps)(NavigationBar);
