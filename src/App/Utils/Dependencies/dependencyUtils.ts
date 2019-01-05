import { Categories } from "../../../constants/Categories";
import { flip } from "../../../Data/Function";
import { foldr, isList, List } from "../../../Data/List";
import { fmap, fromMaybe, isNothing, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../../types/data";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { AllRequirements, DependentPrerequisite } from "../../Models/Wiki/wikiTypeHelpers";
import { getCategoryById } from "../IDUtils";
import { match } from "../match";
import { getPrimaryAttributeId } from "../primaryAttributeUtils";

const { specialAbilities } = HeroModel.A

type ModifySkillDependency =
  (d: SkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

type ModifyActivatableSkillDependency =
  (d: ExtendedSkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

type ModifyActivatableDependency =
  (d: ActivatableDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

const putActivatableDependency =
  (f: ModifyActivatableDependency) =>
  (sourceId: string) =>
  (req: Record<RequireActivatable>) => {
    const { id, active, sid, sid2, tier } = RequireActivatable.A

    const current_id = id (req)

    if (isList (current_id)) {
      if (isNothing (sid (req)) || isNothing (sid2 (req)) || isNothing (tier (req))) {
        return flip (foldr (f (DependencyObject ({
                                                  origin: Just (sourceId),
                                                  active: Just (active (req)),
                                                }))))
                    (current_id)
      }

      return flip (foldr (f (DependencyObject ({
                                                origin: Just (sourceId),
                                                active:
                                                  isList (sid (req))
                                                  ? Just (active (req))
                                                  : Nothing,
                                                sid: sid (req),
                                                sid2: sid2 (req),
                                                tier: tier (req),
                                              }))))
                  (current_id)
    }

    // current_id is no list:

    if (isNothing (sid (req)) || isNothing (sid2 (req)) || isNothing (tier (req))) {
      return f (active (req)) (current_id)
    }

    return f (DependencyObject ({
                                 active:
                                   isList (sid (req))
                                   ? Just (active (req))
                                   : Nothing,
                                 sid: sid (req),
                                 sid2: sid2 (req),
                                 tier: tier (req),
                               }))
             (current_id)
  }

const putPrimaryAttributeDependency =
  (f: ModifySkillDependency) =>
  (req: Record<RequirePrimaryAttribute>) =>
  (state: HeroModelRecord): HeroModelRecord => {
    const { type, value } = RequirePrimaryAttribute.A

    return fromMaybe (state)
                     (fmap ((x: string) => f (value (req)) (x) (state))
                           (getPrimaryAttributeId (specialAbilities (state))
                                                  (type (req))))
  }

const createIncreasableDependencyModifier = (
  state: HeroModelRecord,
  modifyAttribute: ModifyIncreasableDependency,
  modify: ModifyIncreasableDependency,
  sourceId: string
) =>
  (req: Record<RequiresIncreasableObject>) =>
    match<string | List<string>, HeroModelRecord> (req.get ("id"))
      .on (
        (id): id is List<string> => typeof id === "object",
        id => {
          const add = Record.of ({ value: req.get ("value"), origin: sourceId })

          return id.foldl<Hero> (
            accState => e => (
              getCategoryById (e).equals (Maybe.pure (Categories.ATTRIBUTES))
                ? modifyAttribute (e, add) (accState)
                : modify (e, add) (accState)
            )
          ) (state)
        }
      )
      .on (
        id => getCategoryById (id).equals (Maybe.pure (Categories.ATTRIBUTES)),
        id => modifyAttribute (id, req.get ("value")) (state)
      )
      .otherwise (id => modify (id, req.get ("value")) (state))

const modifyDependencies = (
  state: HeroModelRecord,
  prerequisites: List<AllRequirements>,
  sourceId: string,
  modifyAttributeDependency: ModifyIncreasableDependency,
  modifyIncreasableDependency: ModifyIncreasableDependency,
  modifyActivatableDependency: ModifyActivatableDependency
): HeroModelRecord =>
  prerequisites.foldl<Hero> (
    accState => req => match<AllRequirements, HeroModelRecord> (req)
      .on (
        CheckPrerequisiteUtils.isDependentPrerequisite,
        dependentReq =>
          match<DependentPrerequisite, HeroModelRecord> (
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
              e => e.lookup ("sid").notEquals (Maybe.pure ("GR")),
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
  ) (state)

/**
 * Adds dependencies to all required entries to ensure rule validity.
 * @param state All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies fo
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const addDependencies = (
  state: HeroModelRecord,
  prerequisites: List<AllRequirements>,
  sourceId: string
): HeroModelRecord => modifyDependencies (
  state,
  prerequisites,
  sourceId,
  AddDependencyUtils.addAttributeDependency,
  AddDependencyUtils.addIncreasableDependency,
  AddDependencyUtils.addActivatableDependency
)

/**
 * Provides a wrapper for `DependentUtils#addDependencies` to be able to use it
 * in `ListUtils#mergeOptionalStateReducers`.
 */
export const addDependenciesReducer =
  (prerequisites: List<AllRequirements>, sourceId: string) =>
    (state: HeroModelRecord): HeroModelRecord =>
      addDependencies (state, prerequisites, sourceId)

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies
 * from.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const removeDependencies = (
  state: HeroModelRecord,
  prerequisites: List<AllRequirements>,
  sourceId: string
): HeroModelRecord => modifyDependencies (
  state,
  prerequisites,
  sourceId,
  RemoveDependencyUtils.removeAttributeDependency,
  RemoveDependencyUtils.removeIncreasableDependency,
  RemoveDependencyUtils.removeActivatableDependency
)

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies
 * from.
 * @param adds Additional (computed) requirements that are not included in the
 * static requirements.
 * @param sel The SID from the current selection.
 */
export const removeDependenciesReducer =
  (prerequisites: List<AllRequirements>, sourceId: string) =>
    (state: HeroModelRecord): HeroModelRecord =>
      removeDependencies (state, prerequisites, sourceId)
