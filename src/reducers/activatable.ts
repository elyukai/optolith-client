import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import * as Data from '../types/data.d';
import { SpecialAbilityInstance } from '../types/data.d';
import { activate, deactivate, setTier } from '../utils/ActivatableUtils';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import { mergeIntoState, mergeReducedOptionalState, setNewStateItem } from '../utils/ListUtils';
import { DependentInstancesState } from './dependentInstances';

type Action = ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateSpecialAbilityAction |DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction;

export function activatable(state: DependentInstancesState, action: Action): DependentInstancesState {
  switch (action.type) {
    case ActionTypes.ACTIVATE_DISADV: {
      const { id } = action.payload;
      const instance = get(state, id) as Data.ActivatableInstance;
      return mergeReducedOptionalState(
        state,
        instance,
        activate(action.payload)
      );
    }

    case ActionTypes.ACTIVATE_SPECIALABILITY: {
      const { id } = action.payload;
      const instance = state.specialAbilities.get(id);
      if (typeof instance === 'object') {
        return mergeReducedOptionalState<SpecialAbilityInstance>(
          state,
          instance,
          addStyleExtendedSpecialAbilityDependencies,
          addExtendedSpecialAbilityDependency,
          activate(action.payload)
        );
      }
      return state;
    }

    case ActionTypes.DEACTIVATE_DISADV: {
      const { id, index } = action.payload;
      const instance = get(state, id) as Data.ActivatableInstance;
      return mergeReducedOptionalState(
        state,
        instance,
        deactivate(index)
      );
    }

    case ActionTypes.DEACTIVATE_SPECIALABILITY: {
      const { id, index } = action.payload;
      const instance = state.specialAbilities.get(id);
      if (typeof instance === 'object') {
        return mergeReducedOptionalState<SpecialAbilityInstance>(
          state,
          instance,
          removeStyleExtendedSpecialAbilityDependencies,
          removeExtendedSpecialAbilityDependency,
          deactivate(index),
          state => {
            if (id === 'SA_109') {
              const entry = state.combatTechniques.get('CT_17');
              if (typeof entry === 'object') {
                const newEntry = IncreasableUtils.set(entry, 6);
                return setNewStateItem({}, 'CT_17', newEntry);
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
      return mergeIntoState(state, newState);
    }

    default:
      return state;
  }
}

export type StyleDependencyStateKeys = 'combatStyleDependencies' |
  'magicalStyleDependencies' |
  'blessedStyleDependencies';

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to add extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export function addStyleExtendedSpecialAbilityDependencies(
  state: DependentInstancesState,
  instance: Data.SpecialAbilityInstance,
): ToOptionalKeys<DependentInstancesState> {
  let key: StyleDependencyStateKeys | undefined;

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
      [key]: [
        ...oldItems,
        ...newItems
      ]
    };
  }

  return {};
}

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been added.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export function addExtendedSpecialAbilityDependency(
  state: DependentInstancesState,
  instance: Data.SpecialAbilityInstance,
): ToOptionalKeys<DependentInstancesState> {
  let key: StyleDependencyStateKeys | undefined;

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
      // Checks if the requested entry is part of a list of options.
      index = entries.findIndex(e => {
        return Array.isArray(e.id) && e.id.includes(instance.id);
      });
    }

    if (index > -1) {
      const prev = entries.slice(0, index);
      const next = entries.slice(index + 1);
      return {
        [key]: [
          ...prev,
          {
            ...entries[index],
            active: instance.id
          },
          ...next
        ]
      };
    }
  }

  return {};
}

/**
 * Removes extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to remove extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export function removeStyleExtendedSpecialAbilityDependencies(
  state: DependentInstancesState,
  instance: Data.SpecialAbilityInstance,
): ToOptionalKeys<DependentInstancesState> {
  let key: StyleDependencyStateKeys | undefined;

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
      [key]: leftItems
    };
  }

  return {};
}

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been removed.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export function removeExtendedSpecialAbilityDependency(
  state: DependentInstancesState,
  instance: Data.SpecialAbilityInstance,
): ToOptionalKeys<DependentInstancesState> {
  let key: StyleDependencyStateKeys | undefined;

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
    let index = entries.findIndex(e => (
      Array.isArray(e.id) && e.id.includes(instance.id) && e.active === instance.id
    ));

    if (index === -1) {
      index = entries.findIndex(e => (
        e.id === instance.id && e.active === instance.id
      ));
    }

    if (index > -1) {
      const prev = entries.slice(0, index);
      const next = entries.slice(index + 1);

      return {
        [key]: [
          ...prev,
          {
            ...entries[index],
            active: undefined
          },
          ...next
        ]
      };
    }
  }

  return {};
}
