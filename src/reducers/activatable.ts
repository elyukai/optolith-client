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
    case ActionTypes.ACTIVATE_DISADV: {
      const { id } = action.payload;
      return mergeIntoState(state, activate(state, get(state, id) as Data.ActivatableInstance, action.payload));
    }

    case ActionTypes.ACTIVATE_SPECIALABILITY: {
      const { id } = action.payload;
      const instance = state.specialAbilities.get(id);
      return mergeIntoState(addExtendedSpecialAbilityDependency(addStyleExtendedSpecialAbilityDependencies(state, instance), instance), activate(state, instance!, action.payload));
    }

    case ActionTypes.DEACTIVATE_DISADV: {
      const { id, index } = action.payload;
      return mergeIntoState(state, deactivate(state, get(state, id) as Data.ActivatableInstance, index));
    }

    case ActionTypes.DEACTIVATE_SPECIALABILITY: {
      const { id, index } = action.payload;
      const instance = state.specialAbilities.get(id);
      let newlist = mergeIntoState(removeExtendedSpecialAbilityDependency(removeStyleExtendedSpecialAbilityDependencies(state, instance), instance), deactivate(state, get(state, id) as Data.ActivatableInstance, index));
      if (id === 'SA_109') {
        newlist = setStateItem(newlist, 'CT_17', IncreasableUtils.set(get(state, 'CT_17') as Data.CombatTechniqueInstance, 6));
      }
      return newlist;
    }

    case ActionTypes.SET_DISADV_TIER:
    case ActionTypes.SET_SPECIALABILITY_TIER: {
      const { id, index, tier } = action.payload;
      return mergeIntoState(state, setTier(state, get(state, id) as Data.ActivatableInstance, index, tier));
    }

    default:
      return state;
  }
}

export function addStyleExtendedSpecialAbilityDependencies(state: DependentInstancesState, instance: Data.SpecialAbilityInstance | undefined): DependentInstancesState {
  if (instance) {
    let key: 'combatStyleDependencies' | 'magicalStyleDependencies' | 'blessedStyleDependencies' | undefined;
    if (instance.gr === 9 || instance.gr === 10) {
      key = 'combatStyleDependencies';
    }
    else if (instance.gr === 13) {
      key = 'magicalStyleDependencies';
    }
    else if (instance.gr === 25) {
      key = 'blessedStyleDependencies';
    }
    if (typeof key === 'string' && instance.extended) {
      const newItems = instance.extended.map(id => ({
        id,
        origin: instance!.id
      }));
      const oldItems = state[key].map(e => {
        const { id, active } = e;
        if (Array.isArray(id) && typeof active === 'string') {
          const index = newItems.findIndex(e => e.id === active);
          if (index > -1) {
            return {
              ...e,
              active: undefined
            };
          }
        }
        return e;
      });
      return {
        ...state,
        [key]: [ ...oldItems, ...newItems ]
      };
    }
  }
  return state;
}

export function addExtendedSpecialAbilityDependency(state: DependentInstancesState, instance: Data.SpecialAbilityInstance | undefined): DependentInstancesState {
  if (instance) {
    let key: 'combatStyleDependencies' | 'magicalStyleDependencies' | 'blessedStyleDependencies' | undefined;
    if (instance.gr === 11) {
      key = 'combatStyleDependencies';
    }
    else if (instance.gr === 14) {
      key = 'magicalStyleDependencies';
    }
    else if (instance.gr === 26) {
      key = 'blessedStyleDependencies';
    }
    if (typeof key === 'string') {
      const entries = state[key];
      let index = entries.findIndex(e => e.id === instance.id);
      if (index === -1) {
        index = entries.findIndex(e => Array.isArray(e.id) && e.id.includes(instance.id));
      }
      if (index > -1) {
        const prev = entries.slice(0, index);
        const next = entries.slice(index + 1);
        return {
          ...state,
          [key]: [ ...prev, { ...entries[index], active: instance.id }, ...next ]
        };
      }
    }
  }
  return state;
}

export function removeStyleExtendedSpecialAbilityDependencies(state: DependentInstancesState, instance: Data.SpecialAbilityInstance | undefined): DependentInstancesState {
  if (instance) {
    let key: 'combatStyleDependencies' | 'magicalStyleDependencies' | 'blessedStyleDependencies' | undefined;
    if (instance.gr === 9 || instance.gr === 10) {
      key = 'combatStyleDependencies';
    }
    else if (instance.gr === 13) {
      key = 'magicalStyleDependencies';
    }
    else if (instance.gr === 25) {
      key = 'blessedStyleDependencies';
    }
    if (typeof key === 'string' && instance.extended) {
      const {
        itemsToRemove,
        leftItems
      } = state[key].reduce((obj, dependency) => {
        if (dependency.origin === instance.id) {
          return {
            ...obj,
            itemsToRemove: [...obj.itemsToRemove, dependency]
          };
        }
        return {
          ...obj,
          leftItems: [...obj.leftItems, dependency]
        };
      }, {
        itemsToRemove: [] as Data.StyleDependency[],
        leftItems: [] as Data.StyleDependency[]
      });
      for (const dependency of itemsToRemove.filter(e => typeof e.active === 'string')) {
        const index = leftItems.findIndex(e => !Array.isArray(e.id) ? dependency.active === e.id : e.id.includes(dependency.active!) && e.active === undefined);
        leftItems[index] = {
          ...leftItems[index],
          active: dependency.active
        };
      }
      return {
        ...state,
        [key]: leftItems
      };
    }
  }
  return state;
}

export function removeExtendedSpecialAbilityDependency(state: DependentInstancesState, instance: Data.SpecialAbilityInstance | undefined): DependentInstancesState {
  if (instance) {
    let key: 'combatStyleDependencies' | 'magicalStyleDependencies' | 'blessedStyleDependencies' | undefined;
    if (instance.gr === 11) {
      key = 'combatStyleDependencies';
    }
    else if (instance.gr === 14) {
      key = 'magicalStyleDependencies';
    }
    else if (instance.gr === 26) {
      key = 'blessedStyleDependencies';
    }
    if (typeof key === 'string') {
      const entries = state[key];
      let index = entries.findIndex(e => Array.isArray(e.id) && e.id.includes(instance.id) && e.active === instance.id);
      if (index === -1) {
        index = entries.findIndex(e => e.id === instance.id && e.active === instance.id);
      }
      if (index > -1) {
        const prev = entries.slice(0, index);
        const next = entries.slice(index + 1);
        return {
          ...state,
          [key]: [ ...prev, { ...entries[index], active: undefined }, ...next ]
        };
      }
    }
  }
  return state;
}
