import { Culture } from "optolith-database-schema/types/Culture"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Skill } from "optolith-database-schema/types/Skill"
import { Activatable, RatedMap } from "../../main_window/slices/characterSlice.ts"
import { filterNonNullable } from "../utils/array.ts"
import { countOptions } from "./activatableEntry.ts"
import { Rated } from "./ratedEntry.ts"
import { getSkillCheckValues } from "./skillCheck.ts"

// const getMinSRByCraftInstruments = (state : HeroModelRecord) =>
//                                    (entry : Record<SkillCombined>) : Maybe<number> => {
//                                      const id = SCA_.id (entry)
//                                      const { CraftInstruments } = SpecialAbilityId

//                                      if ((id === SkillId.Woodworking || id === SkillId.Metalworking)
//                                          && isMaybeActive (lookupF (HA.specialAbilities (state))
//                                                                    (CraftInstruments))) {
//                                        // Sum of Woodworking and Metalworking must be at least 12.
//                                        const MINIMUM_SUM = 12

//                                        const otherSkillId = id === SkillId.Woodworking
//                                                             ? SkillId.Metalworking
//                                                             : SkillId.Woodworking

//                                        const otherSkillRating = pipe_ (
//                                                                   state,
//                                                                   HA.skills,
//                                                                   lookup <string> (otherSkillId),
//                                                                   fmap (SDA.value),
//                                                                   sum
//                                                                 )

//                                        return Just (MINIMUM_SUM - otherSkillRating)
//                                      }

//                                      return Nothing
//                                    }


// /**
//  * Check if the dependencies allow the passed skill to be decreased.
//  */
// const getMinSRByDeps = (staticData : StaticDataRecord) =>
//                        (hero : HeroModelRecord) =>
//                        (entry : Record<SkillCombined>) : Maybe<number> =>
//                          pipe_ (
//                            entry,
//                            SCA_.dependencies,
//                            flattenDependencies (staticData) (hero),
//                            ensure (notNull),
//                            fmap (maximum)
//                          )

export const getSkillMinimum = (): number => {
  const minimumValues = filterNonNullable([
    0,
    // TODO: getMinSRByDeps (staticData) (hero) (entry),
    // TODO: getMinSRByCraftInstruments (hero) (entry)
  ])

  return Math.max(...minimumValues)
}

export const getSkillMaximum = (
  attributes: RatedMap,
  skill: Skill,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel | undefined,
  exceptionalSkill: Activatable | undefined,
): number => {
  const maximumValues = filterNonNullable([
    Math.max(...getSkillCheckValues(attributes, skill.check)) + 2,
    isInCharacterCreation && startExperienceLevel !== undefined
      ? startExperienceLevel.max_skill_rating
      : undefined,
  ])

  const exceptionalSkillBonus = countOptions(exceptionalSkill, { type: "Skill", value: skill.id })

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

export const isSkillDecreasable = (
  dynamic: Rated,
  min: number,
  canRemove: boolean,
) => min < dynamic.value && canRemove

export const isSkillIncreasable = (
  dynamic: Rated,
  max: number,
) =>
  dynamic.value < max

export const getSkillCommonness = (
  culture: Culture,
  skill: Skill
): "common" | "uncommon" | undefined =>
  culture.common_skills.some(({ id: { skill: id } }) => skill.id === id)
  ? "common"
  : culture.uncommon_skills?.some(({ id: { skill: id } }) => skill.id === id) ?? false
  ? "uncommon"
  : undefined
