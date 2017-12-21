import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as HistoryActions from '../actions/HistoryActions';
import * as InGameActions from '../actions/InGameActions';
import * as LocationActions from '../actions/LocationActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getAdventurePointsSpent, getAdventurePointsSpentForAdvantages, getAdventurePointsSpentForAttributes, getAdventurePointsSpentForBlessedAdvantages, getAdventurePointsSpentForBlessedDisadvantages, getAdventurePointsSpentForBlessings, getAdventurePointsSpentForCantrips, getAdventurePointsSpentForCombatTechniques, getAdventurePointsSpentForDisadvantages, getAdventurePointsSpentForEnergies, getAdventurePointsSpentForLiturgicalChants, getAdventurePointsSpentForMagicalAdvantages, getAdventurePointsSpentForMagicalDisadvantages, getAdventurePointsSpentForSkills, getAdventurePointsSpentForSpecialAbilities, getAdventurePointsSpentForSpells, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from '../selectors/adventurePointsSelectors';
import { getRedoAvailability, getUndoAvailability } from '../selectors/currentHeroSelectors';
import { isLiturgicalChantsTabAvailable } from '../selectors/liturgiesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { isSpellsTabAvailable } from '../selectors/spellsSelectors';
import { getAdventurePointsSpent as getAdventurePointsSpentState, getAvatar, getCurrentTab, getTotalAdventurePoints, isSettingsOpen } from '../selectors/stateSelectors';
import { getSubtabs, getTabs, isHeroSection } from '../selectors/uilocationSelectors';
import { TabId } from '../utils/LocationUtils';
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from '../views/navigationbar/NavigationBar';

function mapStateToProps(state: AppState) {
	return {
		currentTab: getCurrentTab(state),
		avatar: getAvatar(state),
		isRedoAvailable: getRedoAvailability(state),
		isUndoAvailable: getUndoAvailability(state),
		isRemovingEnabled: isRemovingEnabled(state),
		isSettingsOpen: isSettingsOpen(state),
		isHeroSection: isHeroSection(state),
		tabs: getTabs(state),
		subtabs: getSubtabs(state),
		total: getTotalAdventurePoints(state),
		spent: getAdventurePointsSpentState(state),
		spentForAttributes: getAdventurePointsSpentForAttributes(state),
		spentForSkills: getAdventurePointsSpentForSkills(state),
		spentForCombatTechniques: getAdventurePointsSpentForCombatTechniques(state),
		spentForSpells: getAdventurePointsSpentForSpells(state),
		spentForLiturgicalChants: getAdventurePointsSpentForLiturgicalChants(state),
		spentForCantrips: getAdventurePointsSpentForCantrips(state),
		spentForBlessings: getAdventurePointsSpentForBlessings(state),
		spentForAdvantages: getAdventurePointsSpentForAdvantages(state),
		spentForMagicalAdvantages: getAdventurePointsSpentForMagicalAdvantages(state),
		spentForBlessedAdvantages: getAdventurePointsSpentForBlessedAdvantages(state),
		spentForDisadvantages: getAdventurePointsSpentForDisadvantages(state),
		spentForMagicalDisadvantages: getAdventurePointsSpentForMagicalDisadvantages(state),
		spentForBlessedDisadvantages: getAdventurePointsSpentForBlessedDisadvantages(state),
		spentForSpecialAbilities: getAdventurePointsSpentForSpecialAbilities(state),
		spentForEnergies: getAdventurePointsSpentForEnergies(state),
		spentTotal: getAdventurePointsSpent(state),
		maximumForMagicalAdvantagesDisadvantages: getMagicalAdvantagesDisadvantagesAdventurePointsMaximum(state),
		isSpellcaster: isSpellsTabAvailable(state),
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
