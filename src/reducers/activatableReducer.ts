import * as DisAdvActions from '../actions/DisAdvActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { ActionTypes } from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import * as Data from '../types/data.d';
import { SpecialAbilityInstance } from '../types/data.d';
import { activate, deactivate, setTier, rework_activate } from '../utils/ActivatableUtils';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import * as ListUtils from '../utils/ListUtils';
import { DependentInstancesState } from './dependentInstances';
import * as ExtendedStyleUtils from '../utils/ExtendedStyleUtils';
import { reduce } from '../utils/FPUtils';

type Action =
  DisAdvActions.ActivateDisAdvAction |
  DisAdvActions.DeactivateDisAdvAction |
  DisAdvActions.SetDisAdvTierAction |
  SpecialAbilitiesActions.ActivateSpecialAbilityAction |
  SpecialAbilitiesActions.DeactivateSpecialAbilityAction |
  SpecialAbilitiesActions.SetSpecialAbilityTierAction;

export function activatableReducer(
  state: Data.HeroDependent,
  action: Action,
): Data.HeroDependent {
  switch (action.type) {
    case ActionTypes.ACTIVATE_DISADV: {
      const { id } = action.payload;

      return reduce(
        state,
      )(
        rework_activate(action.payload)
      );
    }

    case ActionTypes.ACTIVATE_SPECIALABILITY: {
      const { id } = action.payload;
      const instance = state.specialAbilities.get(id);
      if (typeof instance === 'object') {
        return ListUtils.mergeReducedOptionalState<SpecialAbilityInstance>(
          state,
          instance,
          ExtendedStyleUtils.addStyleExtendedSpecialAbilityDependencies,
          ExtendedStyleUtils.addExtendedSpecialAbilityDependency,
          activate(action.payload)
        );
      }
      return state;
    }

    case ActionTypes.DEACTIVATE_DISADV: {
      const { id, index } = action.payload;
      const instance = get(state, id) as Data.ActivatableInstance;
      return ListUtils.mergeReducedOptionalState(
        state,
        instance,
        deactivate(index)
      );
    }

    case ActionTypes.DEACTIVATE_SPECIALABILITY: {
      const { id, index } = action.payload;
      const instance = state.specialAbilities.get(id);
      if (typeof instance === 'object') {
        return ListUtils.mergeReducedOptionalState<SpecialAbilityInstance>(
          state,
          instance,
          ExtendedStyleUtils.removeStyleExtendedSpecialAbilityDependencies,
          ExtendedStyleUtils.removeExtendedSpecialAbilityDependency,
          deactivate(index),
          state => {
            if (id === 'SA_109') {
              const entry = state.combatTechniques.get('CT_17');
              if (typeof entry === 'object') {
                const newEntry = IncreasableUtils.set(entry, 6);
                return ListUtils.setNewStateItem({}, 'CT_17', newEntry);
              }
            }
            return state;
          }
        );
      }
      return state;
    }

    case ActionTypes.SET_DISADV_TIER:
    case ActionTypes.SET_SPECIALABILITY_TIER: {
      const { id, index, tier } = action.payload;
      const oldEntry = get(state, id) as Data.ActivatableInstance;
      const newState = setTier(state, oldEntry, index, tier);
      return ListUtils.mergeIntoState(state, newState);
    }

    default:
      return state;
  }
}
