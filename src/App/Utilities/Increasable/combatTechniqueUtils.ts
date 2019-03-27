import { fmap } from "../../../Data/Functor";
import { cons, elem, foldl, List, maximum } from "../../../Data/List";
import { guard, Just, Maybe, maybe, sum, then } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { flattenDependencies } from "../Dependencies/flattenDependencies";
import { add, divideBy, max } from "../mathUtils";
import { pipe } from "../pipe";

const { value, dependencies } = SkillDependent.A
const { gr, primary, id } = CombatTechnique.A
const { attributes, experienceLevel, advantages, phase } = HeroModel.A
const { experienceLevels } = WikiModel.A
const { maxCombatTechniqueRating } = ExperienceLevel.A

const getMaxPrimaryAttributeValueById =
  (state: HeroModelRecord) =>
    foldl<string, number> (currentMax => pipe (
                            lookupF (attributes (state)),
                            maybe (currentMax) (pipe (value, max (currentMax)))
                          ))
                          (0)

const calculatePrimaryAttributeMod = pipe (add (-8), divideBy (3), Math.floor, max (0))

export const getPrimaryAttributeMod =
  (state: HeroModelRecord) =>
    pipe (getMaxPrimaryAttributeValueById (state), calculatePrimaryAttributeMod)

const getCombatTechniqueRating = maybe (6) (value)

export const getAttack =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
    pipe (
      getCombatTechniqueRating,
      add (getPrimaryAttributeMod (state)
                                  (gr (wikiEntry) === 2
                                    ? primary (wikiEntry)
                                    : List ("ATTR_1")))
    )

export const getParry =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (maybeStateEntry: Maybe<Record<SkillDependent>>): Maybe<number> =>
    then
      (guard (gr (wikiEntry) !== 2 && id (wikiEntry) !== "CT_6" && id (wikiEntry) !== "CT_8"))
      (Just (
        Math.round (getCombatTechniqueRating (maybeStateEntry) / 2)
        + getPrimaryAttributeMod (state) (primary (wikiEntry))
      ))

export const isIncreaseDisabled =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (instance: Record<SkillDependent>): boolean => {
    const currentMax =
      phase (state) < 3
        ? sum (fmap (maxCombatTechniqueRating)
                    (lookupF (experienceLevels (wiki)) (experienceLevel (state))))
        : getMaxPrimaryAttributeValueById (state) (primary (wikiEntry)) + 2

    const exceptionalSkill = lookupF (advantages (state)) ("ADV_17")

    const bonus = pipe (
                         getActiveSelectionsMaybe,
                         fmap (elem<string | number> (id (instance))),
                         Maybe.elem (true),
                         (x): number => x ? 1 : 0
                       )
                       (exceptionalSkill)

    return value (instance) >= currentMax + bonus
  }

export const isDecreaseDisabled =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (instance: Record<SkillDependent>) =>
  (onlyOneCombatTechniqueForHunter: boolean): boolean => {
    const disabledByHunter =
      onlyOneCombatTechniqueForHunter
      && gr (wikiEntry) === 2
      && value (instance) === 10

    return disabledByHunter
      || value (instance) <= maximum (cons (flattenDependencies<number> (wiki)
                                                                        (state)
                                                                        (dependencies (instance)))
                                           (6))
  }
