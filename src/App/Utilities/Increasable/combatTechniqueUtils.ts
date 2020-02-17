import { fmap } from "../../../Data/Functor"
import { cons, elem, foldl, List, maximum } from "../../../Data/List"
import { guard, Just, Maybe, maybe, then } from "../../../Data/Maybe"
import { add, divideBy, max } from "../../../Data/Num"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { CombatTechniqueGroup } from "../../Constants/Groups"
import { AdvantageId, AttrId, CombatTechniqueId } from "../../Constants/Ids"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils"
import { flattenDependencies } from "../Dependencies/flattenDependencies"
import { pipe } from "../pipe"

const ADA = AttributeDependent.A
const SkDA = SkillDependent.A
const CTA = CombatTechnique.A
const HA = HeroModel.A
const SDA = StaticData.A
const ELA = ExperienceLevel.A

const getMaxPrimaryAttributeValueById =
  (state: HeroModelRecord) =>
    foldl<string, number> (currentMax => pipe (
                            lookupF (HA.attributes (state)),
                            maybe (currentMax) (pipe (ADA.value, max (currentMax)))
                          ))
                          (0)

const calculatePrimaryAttributeMod = pipe (add (-8), divideBy (3), Math.floor, max (0))

export const getPrimaryAttributeMod =
  (state: HeroModelRecord) =>
    pipe (getMaxPrimaryAttributeValueById (state), calculatePrimaryAttributeMod)

const getCombatTechniqueRating = maybe (6) (SkDA.value)

export const getAttack =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
    pipe (
      getCombatTechniqueRating,
      add (getPrimaryAttributeMod (state)
                                  (CTA.gr (wikiEntry) === CombatTechniqueGroup.Ranged
                                    ? CTA.primary (wikiEntry)
                                    : List (AttrId.Courage)))
    )

export const getParry =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (maybeStateEntry: Maybe<Record<SkillDependent>>): Maybe<number> =>
    then (guard (CTA.gr (wikiEntry) !== CombatTechniqueGroup.Ranged
                 && CTA.id (wikiEntry) !== CombatTechniqueId.ChainWeapons
                 && CTA.id (wikiEntry) !== CombatTechniqueId.Brawling))
         (Just (
           Math.round (getCombatTechniqueRating (maybeStateEntry) / 2)
           + getPrimaryAttributeMod (state) (CTA.primary (wikiEntry))
         ))

export const isIncreaseDisabled =
  (staticData: StaticDataRecord) =>
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (instance: Record<SkillDependent>): boolean => {
    const max_by_primary = getMaxPrimaryAttributeValueById (state) (CTA.primary (wikiEntry)) + 2

    const mmax_by_el = then (guard (HA.phase (state) < 3))
                            (fmap (ELA.maxCombatTechniqueRating)
                                  (lookupF (SDA.experienceLevels (staticData))
                                           (HA.experienceLevel (state))))

    const base_max = maybe (max_by_primary) (max (max_by_primary)) (mmax_by_el)

    const exceptionalSkill = lookupF (HA.advantages (state))
                                     (AdvantageId.ExceptionalCombatTechnique)

    const bonus = pipe (
                         getActiveSelectionsMaybe,
                         fmap (elem<string | number> (SkDA.id (instance))),
                         Maybe.elem<boolean> (true),
                         x => x ? 1 : 0
                       )
                       (exceptionalSkill)

    return SkDA.value (instance) >= base_max + bonus
  }

export const isDecreaseDisabled =
  (staticData: StaticDataRecord) =>
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (instance: Record<SkillDependent>) =>
  (onlyOneCombatTechniqueForHunter: boolean): boolean => {
    const disabledByHunter =
      onlyOneCombatTechniqueForHunter
      && CTA.gr (wikiEntry) === 2
      && SkDA.value (instance) === 10

    return disabledByHunter
      || SkDA.value (instance) <= maximum (cons (flattenDependencies (staticData)
                                                                     (state)
                                                                     (SkDA.dependencies (instance)))
                                                (6))
  }
