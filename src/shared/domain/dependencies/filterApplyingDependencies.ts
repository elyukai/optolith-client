// import { fmap } from "../../../Data/Functor"
// import { elem, filter, find, foldl, isList, List, map, maximumNonNegative } from "../../../Data/List"
// import { bindF, Maybe, Nothing, or, sum } from "../../../Data/Maybe"
// import { gt, gte, inc } from "../../../Data/Num"
// import { isRecord, Record } from "../../../Data/Record"
// import { HeroModelRecord } from "../../Models/Hero/HeroModel"
// import { ValueBasedDependent } from "../../Models/Hero/heroTypeHelpers"
// import { SkillOptionalDependency } from "../../Models/Hero/SkillOptionalDependency"
// import { Advantage } from "../../Models/Wiki/Advantage"
// import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
// import { SocialPrerequisite } from "../../Models/Wiki/prerequisites/SocialPrerequisite"
// import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
// import { AbilityRequirement, Activatable } from "../../Models/Wiki/wikiTypeHelpers"
// import { getHeroStateItem } from "../heroStateUtils"
// import { pipe } from "../pipe"
// import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites"
// import { isNumber } from "../typeCheckUtils"
// import { getWikiEntry } from "../WikiUtils"

import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { Preconditions } from "optolith-database-schema/types/prerequisites/ConditionalPrerequisites"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { ActivatableDependency } from "../activatable/activatableDependency.ts"
import { All, GetById } from "../getTypes.ts"
import { countMatchingRatedMinimumNumberEntries } from "../prerequisites/single/ratedMinimumNumberPrerequisiteValidation.ts"
import { sumMatchingRatedSumEntries } from "../prerequisites/single/ratedSumPrerequisiteValidation.ts"
import { GetDynamicLiturgicalChantsByAspectCapability } from "../rated/liturgicalChant.ts"
import { RatedDependency } from "../rated/ratedDependency.ts"
import { GetDynamicSpellworksByPropertyCapability } from "../rated/spell.ts"

/**
 * A function that filters a list of dependencies by if they apply to the
 * entry, since some dependencies target multiple entries but only one of them
 * has to apply. And if other entries match the dependency, the dependency does
 * not need to be matched by this entry.
 */
export type FilterApplyingRatedDependencies = (dependencies: RatedDependency[]) => RatedDependency[]

/**
 * `filterApplyingRatedDependencies` flattens the list of dependencies to usable
 * values. That means, optional dependencies (objects) will be evaluated and
 * will be included in the resulting list, depending on whether it has to follow
 * the optional dependency or not. The result is a plain `List` of all
 * non-optional dependencies.
 */
export const filterApplyingRatedDependencies =
  (
    checkMultipleDisjunctionPartsAreValid: (
      id: ActivatableIdentifier | SkillWithEnhancementsIdentifier,
      index: number,
    ) => boolean,
    caps: {
      getDynamicSkillById: GetById.Dynamic.Skill
      dynamicCloseCombatTechniques: All.Dynamic.CloseCombatTechniques
      dynamicRangedCombatTechniques: All.Dynamic.RangedCombatTechniques
      getDynamicSpellsByProperty: GetDynamicSpellworksByPropertyCapability
      getDynamicRitualsByProperty: GetDynamicSpellworksByPropertyCapability
      getDynamicLiturgicalChantsByAspect: GetDynamicLiturgicalChantsByAspectCapability
      getDynamicCeremoniesByAspect: GetDynamicLiturgicalChantsByAspectCapability
    },
  ): FilterApplyingRatedDependencies =>
  dependencies =>
    dependencies.filter(dep => {
      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(dep.source, dep.index)
      }

      switch (dep.value.tag) {
        case "Fixed":
          return true
        case "MinimumNumberAtMinimumValue":
          return (
            countMatchingRatedMinimumNumberEntries(
              dep.value.minimumValue,
              dep.value.target,
              caps,
            ) <= dep.value.minimumCount
          )
        case "Sum":
          return sumMatchingRatedSumEntries(dep.value.targetIds, caps) <= dep.value.sum
        default:
          return assertExhaustive(dep.value)
      }
    })

/**
 * A function that filters a list of dependencies by if they apply to the
 * entry, since some dependencies target multiple entries but only one of them
 * has to apply. And if other entries match the dependency, the dependency does
 * not need to be matched by this entry.
 */
export type FilterApplyingActivatableDependencies = (
  dependencies: ActivatableDependency[],
) => ActivatableDependency[]

/**
 * `filterApplyingActivatableDependencies` flattens the list of dependencies to
 * usable values. That means, optional dependencies (objects) will be evaluated
 * and will be included in the resulting list, depending on whether it has to
 * follow the optional dependency or not. The result is a plain `List` of all
 * non-optional dependencies.
 */
export const filterApplyingActivatableDependencies =
  (
    checkMultipleDisjunctionPartsAreValid: (id: ActivatableIdentifier, index: number) => boolean,
    checkPreconditions: (prerequisites: Preconditions) => boolean,
  ): FilterApplyingActivatableDependencies =>
  dependencies =>
    dependencies.filter(dep => {
      if (dep.when !== undefined && !checkPreconditions(dep.when)) {
        return false
      }

      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(dep.sourceId, dep.index)
      }

      return true
    })

// (wiki: StaticDataRecord) =>
// (state: HeroModelRecord) =>
// <T extends number | boolean>
// (dependencies: List<T | Record<SkillOptionalDependency>>) =>
//   map<T | Record<SkillOptionalDependency>, T>
//     (e => isRecord (e)
//       ? pipe (
//                getWikiEntry (wiki) as (id: string) => Maybe<Activatable>,
//                bindF (pipe (
//                  prerequisites,
//                  flattenPrerequisites (Nothing) (Nothing),
//                  find ((r): r is AbilityRequirement =>
//                    r !== "RCP"
//                    && !SocialPrerequisite.is (r)
//                    && isList (id (r))
//                    && elem (origin (e)) (id (r) as List<string>))
//                )),
//                fmap (pipe (
//                  id as (r: AbilityRequirement) => List<string>,
//                  foldl<string, number>
//                    (acc => pipe (
//                      getHeroStateItem (state) as (id: string) => Maybe<ValueBasedDependent>,
//                      fmap (pipe (value, gte (value (e)))),
//                      or,
//                      x => x ? inc (acc) : acc
//                    ))
//                    (0),
//                  gt (1),
//                  x => x ? 0 : value (e)
//                )),
//                sum
//              )
//              (origin (e)) as T
//       : e)
//       (dependencies)

// /**
//  * Filters the list of dependencies of `ActivatableSkillDependent`s and returns
//  * the maximum. Minimum: `0`.
//  */
// export const filterAndMaximumNonNegative = pipe(
//   filter<number | boolean, number>(isNumber),
//   maximumNonNegative,
// )
