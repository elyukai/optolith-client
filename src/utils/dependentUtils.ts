import { isEqual } from 'lodash';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { getLatest } from '../selectors/dependentInstancesSelectors';
import { ActivatableInstance, AttributeInstance, ToOptionalKeys, Dependent, HeroDependent, AttributeDependent, SkillDependent, ActivatableSkillDependent, ExtendedSkillDependent, ActivatableDependent } from '../types/data.d';
import { AbilityInstanceExtended, AllRequirements } from '../types/data.d';
import { ActiveDependency, ActiveOptionalDependency, ValueOptionalDependency } from '../types/reusable.d';
import { setNewStateItem, InstancesStateReducer } from './ListUtils';
import * as RequirementUtils from './RequirementUtils';
import { addToArray, removeFromArray } from './rework_collectionUtils';
import { getPrimaryAttributeId } from './rework_attributeUtils';
import { getHeroStateListItem, setHeroListStateItem } from './rework_heroStateUtils';
import { createActivatableDependent, createAttributeDependent, createActivatableDependentSkill, createDependentSkill } from './rework_initHeroUtils';
import { getCategoryById } from './rework_idUtils';
import { Categories } from '../constants/Categories';

function addDependency(obj: Dependent, add: any): Dependent {
  return {
    ...obj,
    dependencies: addToArray(obj.dependencies, add),
  };
}

function removeDependency<D>(obj: Dependent, remove: D): Dependent {
  let index;

  if (typeof remove === 'object') {
    index = (obj.dependencies as D[]).findIndex(e => isEqual(remove, e));
  }
  else {
    index = (obj.dependencies as D[]).findIndex(e => e === remove);
  }

  if (index > -1) {
    return {
      ...obj,
      dependencies: removeFromArray(obj.dependencies as D[], index),
    } as Dependent;
  }

  return obj;
}

function addAttributeDependency(
  state: HeroDependent,
  id: string,
  value: number,
): HeroDependent {
  const entry = getHeroStateListItem<AttributeDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry, value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    createAttributeDependent(id, 8, 0, [value]),
  );
}

function addIncreasableDependency(
  state: HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): HeroDependent {
  const entry = getHeroStateListItem<ExtendedSkillDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry, value),
    );
  }

  const category = getCategoryById(id);

  if (category === Categories.LITURGIES || category === Categories.SPELLS) {
    return setHeroListStateItem(
      state,
      id,
      createActivatableDependentSkill(id, 0, false, [value]),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    createDependentSkill(id, 0, [value]),
  );
}

function addActivatableDependency(
  state: HeroDependent,
  id: string,
  value: boolean | ActiveOptionalDependency,
): HeroDependent {
  const entry = getHeroStateListItem<ActivatableDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry, value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    createActivatableDependent(id, [], [value]),
  );
}

/**
 * Adds dependencies to all required entries to ensure rule validity. The
 * returned Map needs to be merged into the main Map in ListStore.
 * @param state All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies for.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export function addDependencies(
  state: HeroDependent,
  prerequisites: AllRequirements[],
  sourceId: string,
): HeroDependent {
  let newState = { ...state };

  for (const req of prerequisites) {
    if (RequirementUtils.isDependentPrerequisite(req)) {
      if (RequirementUtils.isRequiringPrimaryAttribute(req)) {
        const { type, value } = req;
        const id = getPrimaryAttributeId(state.specialAbilities, type);

        if (id) {
          newState = addAttributeDependency(newState, id, value);
        }
      }
      else if (RequirementUtils.isRequiringIncreasable(req)) {
        const { id, value } = req;

        if (Array.isArray(id)) {
          const add: ValueOptionalDependency = { value, origin: sourceId };

          for (const e of id) {
            newState = addIncreasableDependency(newState, e, add);
          }
        }
        else {
          newState = addIncreasableDependency(newState, id, value);
        }
      }
      else {
        const { id, active, sid, sid2, tier } = req;
        if (sid !== 'GR') {
          if (Array.isArray(id)) {
            let add: ActiveOptionalDependency = { origin: sourceId };
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = { active, ...add };
            }
            else {
              add = { sid, sid2, tier, ...add };
            }
            id.forEach(e => {
              const requiredAbility = getLatest(state, newState, e) as AbilityInstanceExtended;
              if (requiredAbility) {
                newState = setNewStateItem(newState, e, addDependency(requiredAbility, add));
              }
            });
          }
          else {
            let add: boolean | ActiveDependency;
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = active;
            }
            else if (Array.isArray(sid)) {
              add = { active, sid, tier };
            }
            else {
              add = { sid, sid2, tier };
            }
            const requiredAbility = getLatest(state, newState, id) as AbilityInstanceExtended;
            newState = setNewStateItem(newState, id, addDependency(requiredAbility, add));
          }
        }
      }
    }
  }

  return newState;
}

/**
 * Provides a wrapper for `DependentUtils#addDependencies` to be able to use it
 * in `ListUtils#mergeOptionalStateReducers`.
 */
export function addDependenciesReducer(
  prerequisites: AllRequirements[],
  sourceId: string,
): InstancesStateReducer<ActivatableInstance> {
  return state => addDependencies(state, prerequisites, sourceId);
}

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies from.
 * @param adds Additional (computed) requirements that are not included in the static requirements.
 * @param sel The SID from the current selection.
 */
export function removeDependencies(state: DependentInstancesState, requirements: AllRequirements[], sourceId: string): ToOptionalKeys<DependentInstancesState> {
  let instances: ToOptionalKeys<DependentInstancesState> = {};

  requirements.forEach(req => {
    if (req !== 'RCP' && !isRaceRequirement(req) && !isCultureRequirement(req) && !isSexRequirement(req) && !isPactRequirement(req)) {
      if (isRequiringPrimaryAttribute(req)) {
        const { type, value } = req;
        const id = getPrimaryAttributeId(state.specialAbilities, type);
        if (id) {
          const requiredAbility = getLatest(state, instances, id) as AttributeInstance;
          instances = setNewStateItem(instances, id, removeDependency(requiredAbility, value));
        }
      }
      else if (isRequiringIncreasable(req)) {
        const { id, value } = req;
        if (Array.isArray(id)) {
          const add: ValueOptionalDependency = { value, origin: sourceId };
          id.forEach(e => {
            const requiredAbility = getLatest(state, instances, e) as AbilityInstanceExtended;
            if (requiredAbility) {
              instances = setNewStateItem(instances, e, removeDependency(requiredAbility, add));
            }
          });
        }
        else {
          const requiredAbility = getLatest(state, instances, id) as AbilityInstanceExtended;
          instances = setNewStateItem(instances, id, removeDependency(requiredAbility, value));
        }
      }
      else {
        const { id, active, sid, sid2, tier } = req;
        if (sid !== 'GR') {
          if (Array.isArray(id)) {
            let add: ActiveOptionalDependency = { origin: sourceId };
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = { active, ...add };
            }
            else {
              add = { sid, sid2, tier, ...add };
            }
            id.forEach(e => {
              const requiredAbility = getLatest(state, instances, e) as AbilityInstanceExtended;
              if (requiredAbility) {
                instances = setNewStateItem(instances, e, removeDependency(requiredAbility, add));
              }
            });
          }
          else {
            let add: boolean | ActiveDependency;
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = active;
            }
            else if (Array.isArray(sid)) {
              add = { active, sid, tier };
            }
            else {
              add = { sid, sid2, tier };
            }
            const requiredAbility = getLatest(state, instances, id) as AbilityInstanceExtended;
            instances = setNewStateItem(instances, id, removeDependency(requiredAbility, add));
          }
        }
      }
    }
  });
  return instances;
}
