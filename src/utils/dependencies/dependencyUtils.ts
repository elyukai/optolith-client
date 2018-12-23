import * as R from 'ramda';
import { Categories } from '../../constants/Categories';
import * as Data from '../../types/data';
import * as Wiki from '../../types/wiki';
import { getCategoryById } from '../IDUtils';
import { match } from '../match';
import { getPrimaryAttributeId } from '../primaryAttributeUtils';
import * as CheckPrerequisiteUtils from '../wikiData/prerequisites/DependentRequirement';
import * as AddDependencyUtils from './addDependencyUtils';
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
      Maybe.fromMaybe (state) (
        getPrimaryAttributeId (state.get ('specialAbilities'), req.get ('type'))
          .fmap (id => modify (id, req.get ('value')) (state))
      );

const createIncreasableDependencyModifier = (
  state: Record<Data.HeroDependent>,
  modifyAttribute: ModifyIncreasableDependency,
  modify: ModifyIncreasableDependency,
  sourceId: string
) =>
  (req: Record<Wiki.RequiresIncreasableObject>) =>
    match<string | List<string>, Record<Data.HeroDependent>> (req.get ('id'))
      .on (
        (id): id is List<string> => typeof id === 'object',
        id => {
          const add = Record.of ({ value: req.get ('value'), origin: sourceId });

          return id.foldl<Data.Hero> (
            accState => e => (
              getCategoryById (e).equals (Maybe.pure (Categories.ATTRIBUTES))
                ? modifyAttribute (e, add) (accState)
                : modify (e, add) (accState)
            )
          ) (state);
        }
      )
      .on (
        id => getCategoryById (id).equals (Maybe.pure (Categories.ATTRIBUTES)),
        id => modifyAttribute (id, req.get ('value')) (state)
      )
      .otherwise (id => modify (id, req.get ('value')) (state));

const createActivatableDependency = (
  state: Record<Data.HeroDependent>,
  id: List<string>,
  req: Record<Wiki.RequiresActivatableObject>,
  modify: ModifyActivatableDependency
) =>
  R.pipe (
    (sourceId: string) =>
      Record.of<Data.DependencyObject> ({ origin: sourceId }),
    add => {
      if (Object.keys (req).length === 2) {
        return add.insert ('active') (req.get ('active'));
      }
      else {
        const { id: _1, active: _2, ...other } = req.toObject ();

        return add.merge (Record.of (other));
      }
    },
    add => id.foldl<Data.Hero> (accState => e => modify (e, add) (accState)) (state)
  );

const createActivatableDependencyModifier = (
  state: Record<Data.HeroDependent>,
  modify: ModifyActivatableDependency,
  sourceId: string
) => (req: Record<Wiki.RequiresActivatableObject>) => {
  return match<string | List<string>, Record<Data.HeroDependent>> (req.get ('id'))
    .on (
      (id): id is List<string> => typeof id === 'object',
      id => createActivatableDependency (state, id, req, modify) (sourceId)
    )
    .otherwise (id => {
      const { id: _1, active, ...other } = req.toObject ();

      return R.pipe<Data.ActivatableDependency, Record<Data.HeroDependent>> (
        add => modify (id, add) (state)
      ) (
        match<(typeof req), Data.ActivatableDependency> (req)
          .on (
            e => e.keys ().length () === 2,
            () => active
          )
          .on (
            e => Maybe.isJust (Maybe.ensure (m => m instanceof List) (e.lookup ('sid'))),
            () => Record.of<Data.DependencyObject> ({ active, ...other }))
          .otherwise (
            () => Record.of (other)
          )
      );
    });
};

const modifyDependencies = (
  state: Record<Data.HeroDependent>,
  prerequisites: List<Wiki.AllRequirements>,
  sourceId: string,
  modifyAttributeDependency: ModifyIncreasableDependency,
  modifyIncreasableDependency: ModifyIncreasableDependency,
  modifyActivatableDependency: ModifyActivatableDependency
): Record<Data.HeroDependent> =>
  prerequisites.foldl<Data.Hero> (
    accState => req => match<Wiki.AllRequirements, Record<Data.HeroDependent>> (req)
      .on (
        CheckPrerequisiteUtils.isDependentPrerequisite,
        dependentReq =>
          match<Wiki.DependentPrerequisite, Record<Data.HeroDependent>> (
            dependentReq
          )
            .on (
              CheckPrerequisiteUtils.isRequiringPrimaryAttribute,
              createPrimaryAttributeDependencyModifier (
                accState,
                modifyAttributeDependency
              )
            )
            .on (
              CheckPrerequisiteUtils.isRequiringIncreasable,
              createIncreasableDependencyModifier (
                accState,
                modifyAttributeDependency,
                modifyIncreasableDependency,
                sourceId
              )
            )
            .on (
              e => e.lookup ('sid').notEquals (Maybe.pure ('GR')),
              createActivatableDependencyModifier (
                accState,
                modifyActivatableDependency,
                sourceId
              )
            )
            .otherwise (() => accState)
      )
      .otherwise (
        () => accState
      )
  ) (state);

/**
 * Adds dependencies to all required entries to ensure rule validity.
 * @param state All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies for.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const addDependencies = (
  state: Record<Data.HeroDependent>,
  prerequisites: List<Wiki.AllRequirements>,
  sourceId: string
): Record<Data.HeroDependent> => modifyDependencies (
  state,
  prerequisites,
  sourceId,
  AddDependencyUtils.addAttributeDependency,
  AddDependencyUtils.addIncreasableDependency,
  AddDependencyUtils.addActivatableDependency
);

/**
 * Provides a wrapper for `DependentUtils#addDependencies` to be able to use it
 * in `ListUtils#mergeOptionalStateReducers`.
 */
export const addDependenciesReducer =
  (prerequisites: List<Wiki.AllRequirements>, sourceId: string) =>
    (state: Record<Data.HeroDependent>): Record<Data.HeroDependent> =>
      addDependencies (state, prerequisites, sourceId);

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
  sourceId: string
): Record<Data.HeroDependent> => modifyDependencies (
  state,
  prerequisites,
  sourceId,
  RemoveDependencyUtils.removeAttributeDependency,
  RemoveDependencyUtils.removeIncreasableDependency,
  RemoveDependencyUtils.removeActivatableDependency
);

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies
 * from.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const removeDependenciesReducer =
  (prerequisites: List<Wiki.AllRequirements>, sourceId: string) =>
    (state: Record<Data.HeroDependent>): Record<Data.HeroDependent> =>
      removeDependencies (state, prerequisites, sourceId);
