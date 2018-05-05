import { ActivatableInstanceDependency, AllRequirements, HeroDependent } from '../types/data.d';
import { ActiveDependency, ActiveOptionalDependency, ValueOptionalDependency } from '../types/reusable.d';
import * as AddDependencyUtils from './addDependencyUtils';
import * as CheckPrerequisiteUtils from './checkPrerequisiteUtils';
import { getPrimaryAttributeId } from './primaryAttributeUtils';
import { ActivatableReducer } from './reducerUtils';
import * as RemoveDependencyUtils from './removeDependencyUtils';

type ModifyAttributeDependency =
  (state: HeroDependent, id: string, value: number) =>
    HeroDependent;

type ModifyIncreasableDependency =
  (state: HeroDependent, id: string, value: number | ValueOptionalDependency) =>
    HeroDependent;

type ModifyActivatableDependency =
  (state: HeroDependent, id: string, value: ActivatableInstanceDependency) =>
    HeroDependent;

function modifyDependencies(
  state: HeroDependent,
  prerequisites: AllRequirements[],
  sourceId: string,
  modifyAttributeDependency: ModifyAttributeDependency,
  modifyIncreasableDependency: ModifyIncreasableDependency,
  modifyActivatableDependency: ModifyActivatableDependency,
): HeroDependent {
  let newState = { ...state };

  for (const req of prerequisites) {
    if (CheckPrerequisiteUtils.isDependentPrerequisite(req)) {
      if (CheckPrerequisiteUtils.isRequiringPrimaryAttribute(req)) {
        const { type, value } = req;

        const id = getPrimaryAttributeId(state.specialAbilities, type);

        if (id) {
          newState = modifyAttributeDependency(newState, id, value);
        }
      }
      else if (CheckPrerequisiteUtils.isRequiringIncreasable(req)) {
        const { id, value } = req;

        if (Array.isArray(id)) {
          const add: ValueOptionalDependency = { value, origin: sourceId };

          for (const e of id) {
            newState = modifyIncreasableDependency(newState, e, add);
          }
        }
        else {
          newState = modifyIncreasableDependency(newState, id, value);
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

            for (const e of id) {
              newState = modifyActivatableDependency(newState, e, add);
            }
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

            newState = modifyActivatableDependency(newState, id, add);
          }
        }
      }
    }
  }

  return newState;
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
  return modifyDependencies(
    state,
    prerequisites,
    sourceId,
    AddDependencyUtils.addAttributeDependency,
    AddDependencyUtils.addIncreasableDependency,
    AddDependencyUtils.addActivatableDependency,
  );
}

/**
 * Provides a wrapper for `DependentUtils#addDependencies` to be able to use it
 * in `ListUtils#mergeOptionalStateReducers`.
 */
export function addDependenciesReducer(
  prerequisites: AllRequirements[],
  sourceId: string,
): ActivatableReducer {
  return state => addDependencies(state, prerequisites, sourceId);
}

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies
 * from.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export function removeDependencies(
  state: HeroDependent,
  prerequisites: AllRequirements[],
  sourceId: string,
): HeroDependent {
  return modifyDependencies(
    state,
    prerequisites,
    sourceId,
    RemoveDependencyUtils.removeAttributeDependency,
    RemoveDependencyUtils.removeIncreasableDependency,
    RemoveDependencyUtils.removeActivatableDependency,
  );
}
