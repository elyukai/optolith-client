import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import * as Data from '../types/data.d';
import { activate, deactivate, setTier } from '../utils/ActivatableUtils';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import { mergeIntoState, setStateItem } from '../utils/ListUtils';
import { DependentInstancesState } from './dependentInstances';

type Action = ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateSpecialAbilityAction |DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction;

export function activatable(state: DependentInstancesState, action: Action): DependentInstancesState {
	switch (action.type) {
		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.ACTIVATE_SPECIALABILITY: {
			const { id } = action.payload;
			return mergeIntoState(state, activate(state, get(state, id) as Data.ActivatableInstance, action.payload));
		}

		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_SPECIALABILITY: {
			const { id, index } = action.payload;
			let newlist = mergeIntoState(state, deactivate(state, get(state, id) as Data.ActivatableInstance, index));
			if (id === 'SA_125') {
				newlist = setStateItem(newlist, 'CT_17', IncreasableUtils.set(get(state, 'CT_17') as Data.CombatTechniqueInstance, 6));
			}
			return newlist;
		}

		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.SET_SPECIALABILITY_TIER: {
			const { id, index, tier } = action.payload;
			return setStateItem(state, id, setTier(get(state, id) as Data.ActivatableInstance, index, tier));
		}

		default:
			return state;
	}
}
