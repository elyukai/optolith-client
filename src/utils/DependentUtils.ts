import { isEqual } from 'lodash';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { getLatest } from '../selectors/dependentInstancesSelectors';
import { ActivatableInstance, AttributeInstance, BlessingInstance, CantripInstance, SpellInstance, ToOptionalKeys } from '../types/data.d';
import { AbilityInstanceExtended, AllRequirements } from '../types/data.d';
import { ActiveDependency, ActiveOptionalDependency, ValueOptionalDependency } from '../types/reusable.d';
import { getPrimaryAttributeId } from './AttributeUtils';
import { setNewStateItem } from './ListUtils';
import { isCultureRequirement, isPactRequirement, isRaceRequirement, isRequiringIncreasable, isRequiringPrimaryAttribute, isSexRequirement } from './RequirementUtils';

export type AdditionalRequirements = ActivatableInstance | SpellInstance | CantripInstance | BlessingInstance;

function addToArray<T>(array: T[], add: T): T[] {
  return [ ...array, add ];
}

function removeFromArray<T>(array: T[], index: number): T[] {
  array.splice(index, 1);
  return [ ...array ];
}

function addDependency(obj: AbilityInstanceExtended, add: any): AbilityInstanceExtended {
  return {
    ...obj,
    dependencies: addToArray(obj.dependencies, add),
  };
}

function removeDependency<D>(obj: AbilityInstanceExtended, remove: D): AbilityInstanceExtended {
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
    } as AbilityInstanceExtended;
  }
  else {
    return obj;
  }
}

/**
 * Adds dependencies to all required entries to ensure rule validity. The returned Map needs to be merged into the main Map in ListStore.
 * @param state All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies for.
 * @param adds Additional (computed) requirements that are not included in the static requirements.
 * @param sel The SID from the current selection.
 */
export function addDependencies(state: DependentInstancesState, requirements: AllRequirements[], sourceId: string): ToOptionalKeys<DependentInstancesState> {
  let instances: ToOptionalKeys<DependentInstancesState> = {};

  requirements.forEach(req => {
    if (req !== 'RCP' && !isRaceRequirement(req) && !isCultureRequirement(req) && !isSexRequirement(req) && !isPactRequirement(req)) {
      if (isRequiringPrimaryAttribute(req)) {
        const { type, value } = req;
        const id = getPrimaryAttributeId(state.specialAbilities, type);
        if (id) {
          const requiredAbility = getLatest(state, instances, id) as AttributeInstance;
          instances = setNewStateItem(instances, id, addDependency(requiredAbility, value));
        }
      }
      else if (isRequiringIncreasable(req)) {
        const { id, value } = req;
        if (Array.isArray(id)) {
          const add: ValueOptionalDependency = { value, origin: sourceId };
          id.forEach(e => {
            const requiredAbility = getLatest(state, instances, e) as AbilityInstanceExtended;
            if (requiredAbility) {
              instances = setNewStateItem(instances, e, addDependency(requiredAbility, add));
            }
          });
        }
        else {
          const requiredAbility = getLatest(state, instances, id) as AbilityInstanceExtended;
          instances = setNewStateItem(instances, id, addDependency(requiredAbility, value));
        }
      }
      else {
        const { id, active, sid, sid2 } = req;
        if (sid !== 'GR') {
          if (Array.isArray(id)) {
            let add: ActiveOptionalDependency = { origin: sourceId };
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = { active, ...add };
            }
            else {
              add = { sid, sid2, ...add };
            }
            id.forEach(e => {
              const requiredAbility = getLatest(state, instances, e) as AbilityInstanceExtended;
              if (requiredAbility) {
                instances = setNewStateItem(instances, e, addDependency(requiredAbility, add));
              }
            });
          }
          else {
            let add: boolean | ActiveDependency;
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = active;
            }
            else if (Array.isArray(sid)) {
              add = { active, sid };
            }
            else {
              add = { sid, sid2 };
            }
            const requiredAbility = getLatest(state, instances, id) as AbilityInstanceExtended;
            instances = setNewStateItem(instances, id, addDependency(requiredAbility, add));
          }
        }
      }
    }
  });
  return instances;
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
        const { id, active, sid, sid2 } = req;
        if (sid !== 'GR') {
          if (Array.isArray(id)) {
            let add: ActiveOptionalDependency = { origin: sourceId };
            if (Object.keys(req).length === 2 && typeof active === 'boolean') {
              add = { active, ...add };
            }
            else {
              add = { sid, sid2, ...add };
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
              add = { active, sid };
            }
            else {
              add = { sid, sid2 };
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
