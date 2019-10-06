import { fmap } from "../../../Data/Functor";
import { cons, elem, foldl, List, maximum } from "../../../Data/List";
import { guard, Just, Maybe, maybe, sum, then } from "../../../Data/Maybe";
import { add, divideBy, max } from "../../../Data/Num";
import { lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { CombatTechniqueGroup } from "../../Constants/Groups";
import { AdvantageId, AttrId, CombatTechniqueId } from "../../Constants/Ids";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { flattenDependencies } from "../Dependencies/flattenDependencies";
import { pipe } from "../pipe";

const { value, dependencies } = SkillDependent.AL
const { gr, primary, id } = CombatTechnique.AL
const { attributes, experienceLevel, advantages, phase } = HeroModel.AL
const { experienceLevels } = WikiModel.AL
const { maxCombatTechniqueRating } = ExperienceLevel.AL

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
                                  (gr (wikiEntry) === CombatTechniqueGroup.Ranged
                                    ? primary (wikiEntry)
                                    : List (AttrId.Courage)))
    )

export const getParry =
  (state: HeroModelRecord) =>
  (wikiEntry: Record<CombatTechnique>) =>
  (maybeStateEntry: Maybe<Record<SkillDependent>>): Maybe<number> =>
    then (guard (gr (wikiEntry) !== CombatTechniqueGroup.Ranged
                 && id (wikiEntry) !== CombatTechniqueId.ChainWeapons
                 && id (wikiEntry) !== CombatTechniqueId.Brawling))
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

    const exceptionalSkill = lookupF (advantages (state)) (AdvantageId.ExceptionalCombatTechnique)

    const bonus = pipe (
                         getActiveSelectionsMaybe,
                         fmap (elem<string | number> (id (instance))),
                         Maybe.elem<boolean> (true),
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
      || value (instance) <= maximum (cons (flattenDependencies (wiki)
                                                                (state)
                                                                (dependencies (instance)))
                                           (6))
  }
