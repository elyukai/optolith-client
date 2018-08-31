import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as HistoryActions from '../actions/HistoryActions';
import * as InGameActions from '../actions/InGameActions';
import * as LocationActions from '../actions/LocationActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getAdventurePointsObject, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from '../selectors/adventurePointsSelectors';
import { getRedoAvailability, getUndoAvailability } from '../selectors/currentHeroSelectors';
import { isLiturgicalChantsTabAvailable } from '../selectors/liturgiesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getIsSpellsTabAvailable } from '../selectors/spellsSelectors';
import { getAvatar, getCurrentTab, isSettingsOpen } from '../selectors/stateSelectors';
import { getSubtabs, getTabs, getIsHeroSection } from '../selectors/uilocationSelectors';
import { TabId } from '../utils/LocationUtils';
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from '../views/navigationbar/NavigationBar';

function mapStateToProps(state: AppState) {
	return {
		currentTab: getCurrentTab(state),
		avatar: getAvatar(state),
		isRedoAvailable: getRedoAvailability(state),
		isUndoAvailable: getUndoAvailability(state),
		isRemovingEnabled: getIsRemovingEnabled(state),
		isSettingsOpen: isSettingsOpen(state),
		isHeroSection: getIsHeroSection(state),
		tabs: getTabs(state),
		subtabs: getSubtabs(state),
		adventurePoints: getAdventurePointsObject(state),
		maximumForMagicalAdvantagesDisadvantages: getMagicalAdvantagesDisadvantagesAdventurePointsMaximum(state),
		isSpellcaster: getIsSpellsTabAvailable(state),
		isBlessedOne: isLiturgicalChantsTabAvailable(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setTab(id: TabId) {
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
		openSettings() {
			dispatch(SubwindowsActions.openSettings());
		},
		closeSettings() {
			dispatch(SubwindowsActions.closeSettings());
		},
		saveGroup() {
			dispatch(InGameActions._save());
		}
	};
}

export const NavigationBarContainer = connect<NavigationBarStateProps, NavigationBarDispatchProps, NavigationBarOwnProps>(mapStateToProps, mapDispatchToProps)(NavigationBar);
