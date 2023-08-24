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

import { assertExhaustive } from "../../utils/typeSafety.ts"
import { getAttributeValue } from "../attribute.ts"
import { getCombatTechniqueValue } from "../combatTechnique.ts"
import { getLiturgicalChantValue } from "../liturgicalChant.ts"
import {
  ActivatableRatedWithEnhancementsMap,
  RatedDependency,
  RatedMap,
  compareWithRestriction,
} from "../ratedEntry.ts"
import { getSkillValue } from "../skill.ts"
import { getSpellValue } from "../spell.ts"

/**
 * `flattenDependencies` flattens the list of dependencies to usable values.
 * That means, optional dependencies (objects) will be evaluated and will be
 * included in the resulting list, depending on whether it has to follow the
 * optional dependency or not. The result is a plain `List` of all non-optional
 * dependencies.
 * @param wiki The full wiki.
 * @param state The current hero.
 * @param dependencies The list of dependencies to flatten.
 */
export const filterApplyingRatedDependencies =
  (ratedMaps: {
    attributes: RatedMap
    skills: RatedMap
    closeCombatTechniques: RatedMap
    rangedCombatTechniques: RatedMap
    spells: ActivatableRatedWithEnhancementsMap
    rituals: ActivatableRatedWithEnhancementsMap
    liturgicalChants: ActivatableRatedWithEnhancementsMap
    ceremonies: ActivatableRatedWithEnhancementsMap
  }) =>
  (dependencies: RatedDependency[]): RatedDependency[] =>
    dependencies.filter(dep => {
      if (dep.otherTargets) {
        return dep.otherTargets.some(target => {
          switch (target.tag) {
            case "Attribute":
              return compareWithRestriction(
                dep.value,
                getAttributeValue(ratedMaps.attributes[target.attribute]),
              )
            case "Skill":
              return compareWithRestriction(
                dep.value,
                getSkillValue(ratedMaps.skills[target.skill]),
              )
            case "CloseCombatTechnique":
              return compareWithRestriction(
                dep.value,
                getCombatTechniqueValue(
                  ratedMaps.closeCombatTechniques[target.close_combat_technique],
                ),
              )
            case "RangedCombatTechnique":
              return compareWithRestriction(
                dep.value,
                getCombatTechniqueValue(
                  ratedMaps.rangedCombatTechniques[target.ranged_combat_technique],
                ),
              )
            case "Spell":
              return compareWithRestriction(
                dep.value,
                getSpellValue(ratedMaps.spells[target.spell]),
              )
            case "Ritual":
              return compareWithRestriction(
                dep.value,
                getSpellValue(ratedMaps.rituals[target.ritual]),
              )
            case "LiturgicalChant":
              return compareWithRestriction(
                dep.value,
                getLiturgicalChantValue(ratedMaps.liturgicalChants[target.liturgical_chant]),
              )
            case "Ceremony":
              return compareWithRestriction(
                dep.value,
                getLiturgicalChantValue(ratedMaps.ceremonies[target.ceremony]),
              )
            default:
              return assertExhaustive(target)
          }
        })
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