import * as Data from '../types/data';
import { WikiActivatable } from '../types/wiki';
import { convertUIStateToActiveObject, flattenPrerequisites } from './rework_activatableConvertUtils';
import { setHeroListStateItem } from './rework_heroStateUtils';
import { flatten } from 'lodash';

export interface ActivatableActivatePayload extends ActivatableActivateOptions {
  wiki: WikiActivatable;
  instance: Data.ActivatableDependent | undefined;
}

export interface ActivatableActivateOptions {
  id: string;
  sel?: string | number;
  sel2?: string | number;
  input?: string;
  tier?: number;
  cost: number;
  customCost?: number;
}

type ActivatableReducer =
  (state: Data.HeroDependent, wikiEntry: WikiActivatable, instance: Data.ActivatableDependent) =>
    Data.HeroDependent;

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param activate The object given by the view.
 */
export function activate(activate: ActivatableActivateOptions): ActivatableReducer {
  const active = convertUIStateToActiveObject(activate);
  return activateByObject(active);
}

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param active The `ActiveObject`.
 */
export function activateByObject(active: Data.ActiveObject): ActivatableReducer {
  return (state, wikiEntry, instance) => {
    const adds = getGeneratedPrerequisites(obj, active, true);

    const newStateItem = {
      ...obj,
      active: [...obj.active, active],
    };

    const firstState = setStateItem(state, obj.id, newStateItem);

    let prerequisites: ActivatableBasePrerequisites = [];

    if (obj.reqs instanceof Map) {
      if (active.tier) {
        const clonedMap = [...obj.reqs];
        const filteredMap = clonedMap.filter(e => e[0] <= active!.tier!);

        prerequisites = flatten(filteredMap.map(e => e[1]));
      }
    }
    else if (obj.reqs) {
      prerequisites = obj.reqs;
    }

    const combinedPrerequisites = [...prerequisites, ...adds];
    const newState = DependentUtils.addDependencies(firstState, combinedPrerequisites, obj.id);

    return mergeIntoState(firstState, newState);
  };
}

/**
 * Deactivates the entry with the given parameters and removes all previously
 * needed dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param index The index of the `ActiveObject` in `obj.active`.
 */
export function deactivate(index: number): ActivatableReducer {
  return (state, wikiEntry, instance) => {
    const adds = getGeneratedPrerequisites(obj, obj.active[index], false);
    const { tier } = obj.active[index];
    const firstState = setStateItem(state, obj.id, {...obj, active: [...obj.active.slice(0, index), ...obj.active.slice(index + 1)]});
    const prerequisites = flattenPrerequisites(wikiEntry.prerequisites, tier);
    return mergeIntoState(firstState, DependentUtils.removeDependencies(firstState, [...prerequisites, ...adds], obj.id));
  };
}

/**
 * Changes the tier of a specific active entry and adds or removes dependencies
 * if needed.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param index The index of the `ActiveObject` in `obj.active`.
 * @param tier The final tier.
 */
export function setTier(index: number, tier: number): ActivatableReducer {
  return (state, wikiEntry, instance) => {
    const previousTier = instance.active[index].tier;
    const active = [...instance.active];

    active[index] = {
      ...active[index],
      tier,
    };

    const firstState = setHeroListStateItem(
      state,
      instance.id,
      {
        ...instance,
        active,
      }
    );

    if ((wikiEntry.prerequisites instanceof Map) && previousTier && previousTier !== tier) {
      const prerequisites = flattenPrerequisites(wikiEntry.prerequisites, previousTier, tier);

      if (previousTier > tier) {
        return DependentUtils.removeDependencies(
          firstState,
          prerequisites,
          instance.id,
        );
      }

      return DependentUtils.addDependencies(
        firstState,
        prerequisites,
        instance.id,
      );
    }

    return firstState;
  };
}
