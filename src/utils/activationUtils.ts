import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { convertUIStateToActiveObject } from './activatableConvertUtils';
import { updateArrayItem } from './collectionUtils';
import { createActivatableDependent } from './createEntryUtils';
import * as DependencyUtils from './dependencyUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { removeHeroListStateItem, setHeroListStateItem } from './heroStateUtils';
import { addDynamicPrerequisites } from './prerequisitesUtils';
import { ActivatableReducer, OptionalActivatableReducer } from './reducerUtils';
import { isActivatableDependentUnused } from './unusedEntryUtils';

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
  (prerequisites: Wiki.LevelAwarePrerequisites): Wiki.AllRequirements[] => {
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
  return R.pipe(
    getStaticPrerequisites(active),
    addDynamicPrerequisites(wikiEntry, instance, active, add),
  )(wikiEntry.prerequisites);
};

/**
 * Calculates changed instance.
 * @param instance
 * @param changeActive
 */
const getChangedInstance = (
  instance: Data.ActivatableDependent,
  changeActive: ChangeActive,
) => {
  return R.pipe(
    changeActive,
    active => ({
      ...instance,
      active,
    }),
    current => {
      if (isActivatableDependentUnused(current)) {
        return removeHeroListStateItem(instance.id);
      }

      return setHeroListStateItem(instance.id)(current);
    },
  )(instance.active);
};

/**
 * Adds or removes active instance and related prerequisites based on passed
 * functions.
 * @param getActive
 * @param changeDependencies
 * @param changeActive
 * @param add If an entry should be added or removed.
 */
const changeActiveLength = (
  getActive: (instance: Data.ActivatableDependent) => Data.ActiveObject,
  changeDependencies: typeof DependencyUtils.addDependencies,
  changeActive: ChangeActive,
  add: boolean,
): OptionalActivatableReducer => {
  return (
    state,
    wikiEntry,
    instance = createActivatableDependent(wikiEntry.id),
  ) => {
    const active = getActive(instance);

    return changeDependencies(
      getChangedInstance(instance, changeActive)(state),
      getCombinedPrerequisites(wikiEntry, instance, active, add),
      instance.id,
    );
  };
};

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param x0 The object given by the view.
 */
export const activate = R.pipe(
  convertUIStateToActiveObject,
  activateByObject,
);

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param active The `ActiveObject`.
 */
export function activateByObject(
  active: Data.ActiveObject
): OptionalActivatableReducer {
  return changeActiveLength(
    () => active,
    DependencyUtils.addDependencies,
    R.append(active),
    true
  );
}

/**
 * Deactivates the entry with the given parameters and removes all previously
 * needed dependencies.
 * @param index The index of the `ActiveObject` in `obj.active`.
 */
export function deactivate(index: number): ActivatableReducer {
  return changeActiveLength(
    instance => instance.active[index],
    DependencyUtils.removeDependencies,
    R.remove(index, 1),
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

    const active = updateArrayItem(previousActive)(index, {
      ...target,
      tier,
    });

    const firstState = setHeroListStateItem(instance.id)({
      ...instance,
      active,
    })(state);

    if (
      wikiEntry.prerequisites instanceof Map
      && typeof previousTier === 'number'
      && previousTier !== tier) {
      const prerequisites = flattenPrerequisites(
        wikiEntry.prerequisites,
        previousTier,
        tier,
      );

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
