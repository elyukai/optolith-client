import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { AppState } from '../reducers/app';
import { getFilteredActiveSpecialAbilities } from '../selectors/activatableSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getInactiveSpecialAbilitiesFilterText, getPhase, getSpecialAbilities, getSpecialAbilitiesFilterText } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from '../views/skills/SpecialAbilities';
import { getFilteredInactiveSpecialAbilities } from '../selectors/combinedActivatablesSelectors';

function mapStateToProps(state: AppState) {
	return {
		activeList: getFilteredActiveSpecialAbilities(state),
		deactiveList: getFilteredInactiveSpecialAbilities(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
		isRemovingEnabled: isRemovingEnabled(state),
		list: [...getSpecialAbilities(state).values()],
		phase: getPhase(state),
		sortOrder: getSpecialAbilitiesSortOrder(state),
		filterText: getSpecialAbilitiesFilterText(state),
		inactiveFilterText: getInactiveSpecialAbilitiesFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setSortOrder(sortOrder: string) {
			dispatch<any>(SpecialAbilitiesActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch<any>(ConfigActions._switchEnableActiveItemHints());
		},
		addToList(args: ActivateArgs) {
			dispatch<any>(SpecialAbilitiesActions._addToList(args));
		},
		removeFromList(args: DeactivateArgs) {
			dispatch<any>(SpecialAbilitiesActions._removeFromList(args));
		},
		setTier(id: string, index: number, tier: number) {
			dispatch<any>(SpecialAbilitiesActions._setTier(id, index, tier));
		},
		setFilterText(filterText: string) {
			dispatch<any>(SpecialAbilitiesActions.setActiveFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch<any>(SpecialAbilitiesActions.setInactiveFilterText(filterText));
		},
	};
}

export const SpecialAbilitiesContainer = connect<SpecialAbilitiesStateProps, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps>(mapStateToProps, mapDispatchToProps)(SpecialAbilities);
