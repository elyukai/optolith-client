import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { AppState } from '../reducers/app';
import { getDeactiveSpecialAbilities, getSpecialAbilitiesForEdit } from '../selectors/activatableSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getPhase } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from '../views/skills/SpecialAbilities';

function mapStateToProps(state: AppState) {
	return {
		activeList: getSpecialAbilitiesForEdit(state),
		deactiveList: getDeactiveSpecialAbilities(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
		isRemovingEnabled: isRemovingEnabled(state),
		phase: getPhase(state),
		sortOrder: getSpecialAbilitiesSortOrder(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setSortOrder(sortOrder: string) {
			dispatch(SpecialAbilitiesActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch(ConfigActions._switchEnableActiveItemHints());
		},
		addToList(args: ActivateArgs) {
			const action = SpecialAbilitiesActions._addToList(args);
			if (action) {
				dispatch(action);
			}
		},
		removeFromList(args: DeactivateArgs) {
			const action = SpecialAbilitiesActions._removeFromList(args);
			if (action) {
				dispatch(action);
			}
		},
		setTier(id: string, index: number, tier: number, cost: number) {
			const action = SpecialAbilitiesActions._setTier(id, index, tier, cost);
			if (action) {
				dispatch(action);
			}
		}
	};
}

export const SpecialAbilitiesContainer = connect<SpecialAbilitiesStateProps, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps>(mapStateToProps, mapDispatchToProps)(SpecialAbilities);
