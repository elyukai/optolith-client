import { pipe } from "ramda";
import { AttributeDependent } from "../App/Models/ActiveEntries/AttributeDependent";
import { SkillDependent } from "../App/Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../App/Models/Hero/HeroModel";
import { CombatTechnique } from "../App/Models/Wiki/CombatTechnique";
import { ExperienceLevel } from "../App/Models/Wiki/ExperienceLevel";
import { WikiModel, WikiModelRecord } from "../App/Models/Wiki/WikiModel";
import { cons, elem, foldl, fromElements, maximum } from "../Data/List";
import { fmap, guard, Just, Maybe, maybe, sum, then } from "../Data/Maybe";
import { lookup_ } from "../Data/OrderedMap";
import { Record } from "../Data/Record";
import { getActiveSelections } from "./activatable/selectionUtils";
import { flattenDependencies } from "./dependencies/flattenDependencies";
import { add, divideBy, max } from "./mathUtils";

const { value, dependencies } = SkillDependent.A
const { gr, primary, id } = CombatTechnique.A
const { attributes, experienceLevel, advantages, phase } = HeroModel.A
const { experienceLevels } = WikiModel.A
const { maxCombatTechniqueRating } = ExperienceLevel.A

const getMaxPrimaryAttributeValueById =
  (state: HeroModelRecord) =>
    foldl<string, number> (currentMax => pipe (
                            lookup_ (attributes (state)),
                            maybe<Record<AttributeDependent>, number>
                              (currentMax)
                              (pipe (value, max (currentMax)))
                          ))
                          (0)

const calculatePrimaryAttributeMod = pipe (add (-8), divideBy (3), Math.floor, max (0))

export const getPrimaryAttributeMod =
  (state: HeroModelRecord) =>
    pipe (getMaxPrimaryAttributeValueById (state), calculatePrimaryAttributeMod)

const getCombatTechniqueRating = maybe<Record<SkillDependent>, number> (6) (value)

export const getAttack =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
    pipe (
      getCombatTechniqueRating,
      add (getPrimaryAttributeMod (state)
                                  (gr (wikiEntry) === 2
                                    ? primary (wikiEntry)
                                    : fromElements ("ATTR_1")))
    )

export const getParry =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (maybeStateEntry: Maybe<Record<SkillDependent>>): Maybe<number> =>
    then<number>
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
                    (lookup_ (experienceLevels (wiki)) (experienceLevel (state))))
        : getMaxPrimaryAttributeValueById (state) (primary (wikiEntry)) + 2

    const exceptionalSkill = lookup_ (advantages (state)) ("ADV_17")

    const bonus = pipe (
                         getActiveSelections,
                         fmap (elem<string | number> (id (instance))),
                         Maybe.elem (true),
                         x => x ? 1 : 0
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
