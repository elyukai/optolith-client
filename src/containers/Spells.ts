import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpellsActions from '../actions/SpellsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getFilteredActiveSpellsAndCantrips, getFilteredInactiveSpellsAndCantrips, getMagicalTraditions, isActivationDisabled } from '../selectors/spellsSelectors';
import { getAttributes, getBooks, getInactiveSpellsFilterText, getPhase, getSpellsFilterText } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpellsSortOrder } from '../selectors/uisettingsSelectors';
import { Spells, SpellsDispatchProps, SpellsOwnProps, SpellsStateProps } from '../views/skills/Spells';

function mapStateToProps(state: AppState) {
	return {
		activeList: getFilteredActiveSpellsAndCantrips(state),
		inactiveList: getFilteredInactiveSpellsAndCantrips(state),
		attributes: getAttributes(state),
		books: getBooks(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		addSpellsDisabled: isActivationDisabled(state),
		currentHero: getPresent(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		isRemovingEnabled: isRemovingEnabled(state),
		traditions: getMagicalTraditions(state),
		phase: getPhase(state),
		sortOrder: getSpellsSortOrder(state),
		filterText: getSpellsFilterText(state),
		inactiveFilterText: getInactiveSpellsFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			dispatch<any>(SpellsActions._addPoint(id));
		},
		addToList(id: string) {
			dispatch<any>(SpellsActions._addToList(id));
		},
		addCantripToList(id: string) {
			dispatch<any>(SpellsActions._addCantripToList(id));
		},
		removePoint(id: string) {
			dispatch<any>(SpellsActions._removePoint(id));
		},
		removeFromList(id: string) {
			dispatch<any>(SpellsActions._removeFromList(id));
		},
		removeCantripFromList(id: string) {
			dispatch<any>(SpellsActions._removeCantripFromList(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch<any>(SpellsActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch<any>(ConfigActions._switchEnableActiveItemHints());
		},
		setFilterText(filterText: string) {
			dispatch<any>(SpellsActions.setActiveFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch<any>(SpellsActions.setInactiveFilterText(filterText));
		},
	};
}

export const SpellsContainer = connect<SpellsStateProps, SpellsDispatchProps, SpellsOwnProps>(mapStateToProps, mapDispatchToProps)(Spells);
