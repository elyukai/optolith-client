import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpellsActions from '../actions/SpellsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
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
		isRemovingEnabled: getIsRemovingEnabled(state),
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
			dispatch(SpellsActions._addPoint(id));
		},
		addToList(id: string) {
			dispatch(SpellsActions._addToList(id));
		},
		addCantripToList(id: string) {
			dispatch(SpellsActions._addCantripToList(id));
		},
		removePoint(id: string) {
			dispatch(SpellsActions._removePoint(id));
		},
		removeFromList(id: string) {
			dispatch(SpellsActions._removeFromList(id));
		},
		removeCantripFromList(id: string) {
			dispatch(SpellsActions._removeCantripFromList(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(SpellsActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch(ConfigActions._switchEnableActiveItemHints());
		},
		setFilterText(filterText: string) {
			dispatch(SpellsActions.setActiveFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch(SpellsActions.setInactiveFilterText(filterText));
		},
	};
}

export const SpellsContainer = connect<SpellsStateProps, SpellsDispatchProps, SpellsOwnProps>(mapStateToProps, mapDispatchToProps)(Spells);
