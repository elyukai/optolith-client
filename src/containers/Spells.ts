import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpellsActions from '../actions/SpellsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAllForView, isActivationDisabled } from '../selectors/spellsSelectors';
import { getAttributes, getBooks, getPhase } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpellsSortOrder } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { Spells, SpellsDispatchProps, SpellsOwnProps, SpellsStateProps } from '../views/skills/Spells';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		books: getBooks(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		addSpellsDisabled: isActivationDisabled(state),
		currentHero: getPresent(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		isRemovingEnabled: isRemovingEnabled(state),
		list: getAllForView(state),
		phase: getPhase(state),
		sortOrder: getSpellsSortOrder(state)
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
		}
	};
}

export const SpellsContainer = connect<SpellsStateProps, SpellsDispatchProps, SpellsOwnProps>(mapStateToProps, mapDispatchToProps)(Spells);
