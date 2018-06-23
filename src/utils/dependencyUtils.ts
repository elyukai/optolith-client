import R from 'ramda';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import * as AddDependencyUtils from './addDependencyUtils';
import * as CheckPrerequisiteUtils from './checkPrerequisiteUtils';
import { List, Maybe, Record } from './dataUtils';
import { getCategoryById } from './IDUtils';
import { match } from './match';
import { getPrimaryAttributeId } from './primaryAttributeUtils';
import { ActivatableReducer } from './reducerUtils';
import * as RemoveDependencyUtils from './removeDependencyUtils';

type ModifyIncreasableDependency =
  (id: string, value: Data.SkillDependency) =>
    (state: Record<Data.HeroDependent>) =>
      Record<Data.HeroDependent>;

type ModifyActivatableDependency =
  (id: string, value: Data.ActivatableDependency) =>
    (state: Record<Data.HeroDependent>) =>
      Record<Data.HeroDependent>;

const createPrimaryAttributeDependencyModifier =
  (state: Record<Data.HeroDependent>, modify: ModifyIncreasableDependency) =>
    (req: Record<Wiki.RequiresPrimaryAttribute>) =>
      getPrimaryAttributeId(state.get('specialAbilities'), req.get('type'))
        .map(id => modify(id, req.get('value'))(state));

const createIncreasableDependencyModifier = (
  state: Record<Data.HeroDependent>,
  modifyAttribute: ModifyIncreasableDependency,
  modify: ModifyIncreasableDependency,
  sourceId: string,
) =>
  (req: Record<Wiki.RequiresIncreasableObject>) =>
    match<string | List<string>, Record<Data.HeroDependent>>(req.get('id'))
      .on((id): id is List<string> => typeof id === 'object', id => {
        const add = Record.of({ value: req.get('value'), origin: sourceId });

        return id.foldl(
          state => e => (
            getCategoryById(e).equals(Maybe.Just(Categories.ATTRIBUTES))
              ? modifyAttribute(e, add)(state)
              : modify(e, add)(state)
          ),
          state
        );
      })
      .on(id => getCategoryById(id).equals(Maybe.Just(Categories.ATTRIBUTES)), id => {
        return modifyAttribute(id, req.value)(state);
      })
      .otherwise(id => {
        return modify(id, req.value)(state);
      });

const createActivatableDependencyModifier = (
  state: Data.HeroDependent,
  modify: ModifyActivatableDependency,
  sourceId: string,
) => (req: Reusable.RequiresActivatableObject) => {
  const { id: _, active, ...other } = req;

  return match<string | string[], Data.HeroDependent>(req.id)
    .on((id): id is string[] => typeof id === 'object', (id: string[]) => {
      return R.pipe(
        add => {
          if (Object.keys(req).length === 2 && typeof active === 'boolean') {
            return {
              ...add,
              active,
            };
          }
          else {
            return {
              ...add,
              ...other,
            };
          }
        },
        add => id.reduce((state, e) => modify(e, add)(state), state)
      )({ origin: sourceId });
    })
    .otherwise(id => {
      return R.pipe<boolean | Reusable.ActiveDependency, Data.HeroDependent>(
        add => modify(id, add)(state),
      )(
        match<Reusable.RequiresActivatableObject, boolean | Reusable.ActiveDependency>(req)
          .on(
            req => Object.keys(req).length === 2 && typeof active === 'boolean',
            () => active
          )
          .on(req => Array.isArray(req.sid), () => ({ active, ...other }))
          .otherwise(() => other)
      );
    });
};

const modifyDependencies = (
  state: Record<Data.HeroDependent>,
  prerequisites: List<Data.AllRequirements>,
  sourceId: string,
  modifyAttributeDependency: ModifyIncreasableDependency,
  modifyIncreasableDependency: ModifyIncreasableDependency,
  modifyActivatableDependency: ModifyActivatableDependency,
): Record<Data.HeroDependent> => prerequisites.foldl<Data.HeroDependent>(
  state => req => match<Data.AllRequirements, Data.HeroDependent>(req)
    .on(CheckPrerequisiteUtils.isDependentPrerequisite, req => {
      return match<Data.DependentPrerequisite, Data.HeroDependent>(req)
        .on(
          CheckPrerequisiteUtils.isRequiringPrimaryAttribute,
          createPrimaryAttributeDependencyModifier(
            state,
            modifyAttributeDependency,
          ),
        )
        .on(
          CheckPrerequisiteUtils.isRequiringIncreasable,
          createIncreasableDependencyModifier(
            state,
            modifyAttributeDependency,
            modifyIncreasableDependency,
            sourceId,
          ),
        )
        .on(
          req => req.sid !== 'GR',
          createActivatableDependencyModifier(
            state,
            modifyActivatableDependency,
            sourceId,
          ),
        )
        .otherwise(() => state);
    })
    .otherwise(() => state),
  { ...state }
);

/**
 * Adds dependencies to all required entries to ensure rule validity. The
 * returned Map needs to be merged into the main Map in ListStore.
 * @param state All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies for.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const addDependencies = (
  state: Record<Data.HeroDependent>,
  prerequisites: List<Wiki.AllRequirements>,
  sourceId: string,
): Record<Data.HeroDependent> => modifyDependencies(
  state,
  prerequisites,
  sourceId,
  AddDependencyUtils.addAttributeDependency,
  AddDependencyUtils.addIncreasableDependency,
  AddDependencyUtils.addActivatableDependency,
);

/**
 * Provides a wrapper for `DependentUtils#addDependencies` to be able to use it
 * in `ListUtils#mergeOptionalStateReducers`.
 */
export const addDependenciesReducer = (
  prerequisites: Data.AllRequirements[],
  sourceId: string,
): ActivatableReducer =>
  state => addDependencies(state, prerequisites, sourceId);

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies
 * from.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const removeDependencies = (
  state: Record<Data.HeroDependent>,
  prerequisites: List<Wiki.AllRequirements>,
  sourceId: string,
): Record<Data.HeroDependent> => modifyDependencies(
  state,
  prerequisites,
  sourceId,
  RemoveDependencyUtils.removeAttributeDependency,
  RemoveDependencyUtils.removeIncreasableDependency,
  RemoveDependencyUtils.removeActivatableDependency,
);
