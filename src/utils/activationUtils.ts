import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { convertUIStateToActiveObject, flattenPrerequisites } from './activatableConvertUtils';
import { addToArray, removeFromArray, setArrayItem } from './collectionUtils';
import { createActivatableDependent } from './createEntryUtils';
import * as DependencyUtils from './dependencyUtils';
import { setHeroListStateItem } from './heroStateUtils';
import { pipe } from './pipe';
import { addDynamicPrerequisites } from './prerequisitesUtils';
import { ActivatableReducer, OptionalActivatableReducer } from './reducerUtils';

export interface ActivatableActivatePayload extends ActivatableActivateOptions {
  wiki: Wiki.WikiActivatable;
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

type ChangeActive = (activeArr: Data.ActiveObject[]) => Data.ActiveObject[];

const getStaticPrerequisites = (active: Data.ActiveObject) =>
  (prerequisites: Wiki.LevelAwareActivatablePrerequisites): Wiki.AllRequirements[] => {
    const { tier = 1 } = active;
    return flattenPrerequisites(prerequisites, tier);
  };

/**
 * Get matching flattened final static and dynamic prerequisites.
 * @param wikiEntry
 * @param instance
 * @param active
 */
const getCombinedPrerequisites = (
  wikiEntry: Wiki.WikiActivatable,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
  add: boolean,
): Wiki.AllRequirements[] => {
  return pipe(
    getStaticPrerequisites(active),
    addDynamicPrerequisites(wikiEntry, instance, active, add),
  )(wikiEntry.prerequisites);
};

/**
 * Calculates changed instance.
 * @param state
 * @param instance
 * @param changeActive
 */
const getChangedInstance = (
  state: Data.HeroDependent,
  instance: Data.ActivatableDependent,
  changeActive: ChangeActive,
) => {
  return setHeroListStateItem(state, instance.id, {
    ...instance,
    active: changeActive(instance.active),
  });
};

/**
 * Adds or removes active instance and related prerequisites based on passed
 * functions.
 * @param getActive
 * @param changeDependencies
 * @param changeActive
 */
const changeActiveLength = (
  getActive: (instance: Data.ActivatableDependent) => Data.ActiveObject,
  changeDependencies: typeof DependencyUtils.addDependencies,
  changeActive: ChangeActive,
  add: boolean,
): OptionalActivatableReducer => {
  return (state, wikiEntry, instance = createActivatableDependent(wikiEntry.id)) => {
    const active = getActive(instance);

    return changeDependencies(
      getChangedInstance(state, instance, changeActive),
      getCombinedPrerequisites(wikiEntry, instance, active, add),
      instance.id,
    );
  };
};

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param activate The object given by the view.
 */
export function activate(activate: ActivatableActivateOptions): OptionalActivatableReducer {
  const active = convertUIStateToActiveObject(activate);
  return activateByObject(active);
}

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param active The `ActiveObject`.
 */
export function activateByObject(active: Data.ActiveObject): OptionalActivatableReducer {
  return changeActiveLength(
    () => active,
    DependencyUtils.addDependencies,
    arr => addToArray(arr, active),
    true
  );
}

/**
 * Deactivates the entry with the given parameters and removes all previously
 * needed dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param index The index of the `ActiveObject` in `obj.active`.
 */
export function deactivate(index: number): ActivatableReducer {
  return changeActiveLength(
    instance => instance.active[index],
    DependencyUtils.removeDependencies,
    arr => removeFromArray(arr, index),
    false
  );
}

/**
 * Changes the tier of a specific active entry and adds or removes dependencies
 * if needed.
 * @param index The index of the `ActiveObject` in `instance.active`.
 * @param tier The final tier.
 */
export function setTier(index: number, tier: number): ActivatableReducer {
  return (state, wikiEntry, instance) => {
    const previousActive = instance.active;
    const target = previousActive[index];

    const previousTier = target.tier;

    const active = setArrayItem(previousActive, index, {
      ...target,
      tier,
    });

    const firstState = setHeroListStateItem(state, instance.id, {
      ...instance,
      active,
    });

    if (wikiEntry.prerequisites instanceof Map && typeof previousTier === 'number' && previousTier !== tier) {
      const prerequisites = flattenPrerequisites(wikiEntry.prerequisites, previousTier, tier);

      if (previousTier > tier) {
        return DependencyUtils.removeDependencies(
          firstState,
          prerequisites,
          instance.id,
        );
      }
      else {
        return DependencyUtils.addDependencies(
          firstState,
          prerequisites,
          instance.id,
        );
      }
    }

    return firstState;
  };
}
