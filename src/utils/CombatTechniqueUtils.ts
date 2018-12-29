import { pipe } from 'ramda';
import { getActiveSelections } from './activatable/selectionUtils';
import { AttributeDependent } from './activeEntries/AttributeDependent';
import { SkillDependent, SkillDependentG } from './activeEntries/SkillDependent';
import { flattenDependencies } from './dependencies/flattenDependencies';
import { HeroModelG, HeroModelRecord } from './heroData/HeroModel';
import { add, divideBy, max } from './mathUtils';
import { cons, elem, foldl, fromElements, maximum } from './structures/List';
import { fmap, guard, Just, Maybe, maybe, sum, then } from './structures/Maybe';
import { lookup_ } from './structures/OrderedMap';
import { Record } from './structures/Record';
import { CombatTechnique, CombatTechniqueG } from './wikiData/CombatTechnique';
import { ExperienceLevelG } from './wikiData/ExperienceLevel';
import { WikiModelG, WikiModelRecord } from './wikiData/WikiModel';

const { value, dependencies } = SkillDependentG
const { gr, primary, id } = CombatTechniqueG
const { attributes, experienceLevel, advantages, phase } = HeroModelG
const { experienceLevels } = WikiModelG
const { maxCombatTechniqueRating } = ExperienceLevelG

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
                                    : fromElements ('ATTR_1')))
    )

export const getParry =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (maybeStateEntry: Maybe<Record<SkillDependent>>): Maybe<number> =>
    then<number>
      (guard (gr (wikiEntry) !== 2 && id (wikiEntry) !== 'CT_6' && id (wikiEntry) !== 'CT_8'))
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

    const exceptionalSkill = lookup_ (advantages (state)) ('ADV_17')

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
