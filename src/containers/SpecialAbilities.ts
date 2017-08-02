import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { SPECIAL_ABILITIES } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { getActiveForView, getDeactiveForView } from '../selectors/activatableSelectors';
import { getAp } from '../selectors/adventurePointsSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { getPhase } from '../selectors/phaseSelectors';
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from '../views/skills/SpecialAbilities';

function mapStateToProps(state: AppState) {
	return {
		activeList: getActiveForView(getPresent(state), SPECIAL_ABILITIES),
		deactiveList: getDeactiveForView(getPresent(state), SPECIAL_ABILITIES),
		enableActiveItemHints: getEnableActiveItemHints(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
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
