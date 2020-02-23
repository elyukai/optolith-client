/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { consF, countWith, foldr, List, maximum, minimum, notNull } from "../../../Data/List"
import { bindF, catMaybes, elem, ensure, Just, maybe, Maybe, Nothing, sum } from "../../../Data/Maybe"
import { add, gt } from "../../../Data/Num"
import { lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { SkillId, SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { SkillCombined, SkillCombinedA_ } from "../../Models/View/SkillCombined"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { Skill } from "../../Models/Wiki/Skill"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { EntryWithCheck } from "../../Models/Wiki/wikiTypeHelpers"
import { isMaybeActive } from "../Activatable/isActive"
import { flattenDependencies } from "../Dependencies/flattenDependencies"
import { pipe, pipe_ } from "../pipe"
import { getSkillCheckValues } from "./attributeUtils"


const HA = HeroModel.A
const ADA = ActivatableDependent.A
const AOA = ActiveObject.A
const SCA = SkillCombined.A
const SCA_ = SkillCombinedA_
const ELA = ExperienceLevel.A
const SA = Skill.A
const SAL = Skill.AL
const SDA = SkillDependent.A


/**
 * `getExceptionalSkillBonus skillId exceptionalSkillStateEntry`
 * @param skillId The skill's id.
 * @param exceptionalSkill The state entry of Exceptional Skill.
 */
export const getExceptionalSkillBonus = (exceptionalSkill : Maybe<Record<ActivatableDependent>>) =>
                                        (skillId : string) : number =>
                                          maybe (0)
                                                (pipe (
                                                  ADA.active,
                                                  countWith (pipe (
                                                    AOA.sid,
                                                    elem<string | number> (skillId)
                                                  ))
                                                ))
                                                (exceptionalSkill)


/**
 * Creates the base for a list for calculating the maximum of a skill based on
 * the skill check's atrributes' values.
 */
export const getMaxSRByCheckAttrs = (attrs : HeroModel["attributes"]) =>
                                    (wiki_entry : EntryWithCheck) : number =>
                                      pipe_ (
                                        wiki_entry,
                                        SAL.check,
                                        getSkillCheckValues (attrs),
                                        consF (8),
                                        maximum,
                                        add (2)
                                      )


/**
 * Adds the maximum skill rating defined by the chosen experience level to the
 * list created by `getInitialMaximumList` if the hero is in character creation
 * phase.
 */
export const getMaxSRFromEL = (startEL : Record<ExperienceLevel>) =>
                              (phase : number) : Maybe<number> =>
                                phase < 3 ? Just (ELA.maxSkillRating (startEL)) : Nothing


/**
 * Returns the maximum skill rating for the passed skill.
 */
export const getSkillMax = (startEL : Record<ExperienceLevel>) =>
                           (phase : number) =>
                           (attributes : OrderedMap<string, Record<AttributeDependent>>) =>
                           (exceptionalSkill : Maybe<Record<ActivatableDependent>>) =>
                           (wiki_entry : Record<Skill>) : number =>
                             pipe_ (
                               List (
                                 Just (getMaxSRByCheckAttrs (attributes) (wiki_entry)),
                                 getMaxSRFromEL (startEL) (phase)
                               ),
                               catMaybes,
                               minimum,
                               add (getExceptionalSkillBonus (exceptionalSkill)
                                                             (SA.id (wiki_entry)))
                             )


/**
 * Returns if the passed skill's skill rating can be increased.
 */
export const isSkillIncreasable = (startEL : Record<ExperienceLevel>) =>
                                  (phase : number) =>
                                  (attrs : OrderedMap<string, Record<AttributeDependent>>) =>
                                  (exceptionalSkill : Maybe<Record<ActivatableDependent>>) =>
                                  (entry : Record<SkillCombined>) : boolean =>
                                    SCA_.value (entry) < getSkillMax (startEL)
                                                                     (phase)
                                                                     (attrs)
                                                                     (exceptionalSkill)
                                                                     (SCA.wikiEntry (entry))


const getMinSRByCraftInstruments = (state : HeroModelRecord) =>
                                   (entry : Record<SkillCombined>) : Maybe<number> => {
                                     const id = SCA_.id (entry)
                                     const { CraftInstruments } = SpecialAbilityId

                                     if ((id === SkillId.Woodworking || id === SkillId.Metalworking)
                                         && isMaybeActive (lookupF (HA.specialAbilities (state))
                                                                   (CraftInstruments))) {
                                       // Sum of Woodworking and Metalworking must be at least 12.
                                       const MINIMUM_SUM = 12

                                       const otherSkillId = id === SkillId.Woodworking
                                                            ? SkillId.Metalworking
                                                            : SkillId.Woodworking

                                       const otherSkillRating = pipe_ (
                                                                  state,
                                                                  HA.skills,
                                                                  lookup <string> (otherSkillId),
                                                                  fmap (SDA.value),
                                                                  sum
                                                                )

                                       return Just (MINIMUM_SUM - otherSkillRating)
                                     }

                                     return Nothing
                                   }


/**
 * Check if the dependencies allow the passed skill to be decreased.
 */
const getMinSRByDeps = (staticData : StaticDataRecord) =>
                       (hero : HeroModelRecord) =>
                       (entry : Record<SkillCombined>) : Maybe<number> =>
                         pipe_ (
                           entry,
                           SCA_.dependencies,
                           flattenDependencies (staticData) (hero),
                           ensure (notNull),
                           fmap (maximum)
                         )


/**
 * Returns the minimum skill rating for the passed skill.
 */
export const getSkillMin = (staticData : StaticDataRecord) =>
                           (hero : HeroModelRecord) =>
                           (entry : Record<SkillCombined>) : Maybe<number> =>
                             pipe_ (
                               List (
                                 getMinSRByDeps (staticData) (hero) (entry),
                                 getMinSRByCraftInstruments (hero) (entry)
                               ),
                               catMaybes,
                               ensure (notNull),
                               fmap (maximum)
                             )


/**
 * Returns if the passed skill's skill rating can be decreased.
 */
export const isSkillDecreasable = (staticData : StaticDataRecord) =>
                                  (hero : HeroModelRecord) =>
                                  (entry : Record<SkillCombined>) : boolean =>
                                    SCA_.value (entry) > sum (getSkillMin (staticData)
                                                                          (hero)
                                                                          (entry))


const hasSkillFrequencyRating = (category : EntryRating) =>
                                (rating : OrderedMap<string, EntryRating>) =>
                                  pipe (
                                    SA.id,
                                    lookupF (rating),
                                    elem <EntryRating> (category)
                                  )


/**
 * Is the skill common in the hero's culture?
 */
export const isSkillCommon : (rating : OrderedMap<string, EntryRating>)
                           => (wiki_entry : Record<Skill>)
                           => boolean
                           = hasSkillFrequencyRating (EntryRating.Common)


/**
 * Is the skill uncommon in the hero's culture?
 */
export const isSkillUncommon : (rating : OrderedMap<string, EntryRating>)
                             => (wiki_entry : Record<Skill>)
                             => boolean
                             = hasSkillFrequencyRating (EntryRating.Uncommon)


const ROUTINE_ATTR_THRESHOLD = 13


/**
 * Returns the total of missing attribute points for a routine check without
 * using the optional rule for routine checks, because the minimum attribute
 * value is 13 in that case.
 */
const getMissingPoints = (checkAttributeValues : List<number>) =>
                           foldr ((attr : number) : ident<number> =>
                                   attr < ROUTINE_ATTR_THRESHOLD
                                   ? add (ROUTINE_ATTR_THRESHOLD - attr)
                                   : ident)
                                 (0)
                                 (checkAttributeValues)


/**
 * Returns the minimum check modifier from which a routine check is possible
 * without using the optional rule for routine checks.
 */
const getBaseMinCheckMod = (sr : number) => -Math.floor ((sr - 1) / 3) + 3


/**
 * Returns the minimum check modifier from which a routine check is possible for
 * the passed skill rating. Returns `Nothing` if no routine check is possible,
 * otherwise a `Just` of a pair, where the first value is the minimum check
 * modifier and the second a boolean, where `True` states that the minimum check
 * modifier is only valid when using the optional rule for routine checks, thus
 * otherwise a routine check would not be possible.
 */
export const getMinCheckModForRoutine : (checkAttributeValues : List<number>)
                                      => (skillRating : number)
                                      => Maybe<Pair<number, boolean>>
                                      = checkAttrValues =>
                                        pipe (
                                          // Routine checks do only work if the SR is larger than 0
                                          ensure (gt (0)),
                                          bindF (sr => {
                                            const missingPoints = getMissingPoints (checkAttrValues)
                                            const checkModThreshold = getBaseMinCheckMod (sr)

                                            const dependentCheckMod = checkModThreshold
                                                                      + missingPoints

                                            return dependentCheckMod < 4
                                              ? Just (Pair (dependentCheckMod, missingPoints > 0))
                                              : Nothing
                                          })
                                        )
