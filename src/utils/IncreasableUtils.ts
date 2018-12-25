import { Categories, IncreasableCategory } from '../constants/Categories';
import { SkillDependent, ValueBasedDependent } from '../types/data';
import { IncreasableEntry, Skill } from '../types/wiki';
import { ActivatableSkillDependentL, isActivatableSkillDependent } from './activeEntries/activatableSkillDependent';
import { AttributeDependentL, isAttributeDependent } from './activeEntries/attributeDependent';
import { SkillDependentG, SkillDependentL } from './activeEntries/skillDependent';
import { getAreSufficientAPAvailable } from './adventurePoints/adventurePointsUtils';
import { getIncreaseAP } from './adventurePoints/improvementCostUtils';
import { dec, inc } from './mathUtils';
import { Lens, over } from './structures/Lens';
import { fmap, fromMaybe, Maybe } from './structures/Maybe';
import { Record } from './structures/Record';
import { SkillG } from './wikiData/SkillCreator';
import { isAttribute } from './WikiUtils';

export const set =
  <T extends ValueBasedDependent> (instance: T) => (x: number): T =>
    isAttributeDependent (instance)
    ? Lens.set (AttributeDependentL.value) (x) (instance) as T
    : isActivatableSkillDependent (instance)
    ? Lens.set (ActivatableSkillDependentL.value) (x) (instance) as T
    : Lens.set (SkillDependentL.value) (x) (instance as Record<SkillDependent>) as T

export const addPoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    isAttributeDependent (instance)
    ? over (AttributeDependentL.value) (inc) (instance) as T
    : isActivatableSkillDependent (instance)
    ? over (ActivatableSkillDependentL.value) (inc) (instance) as T
    : over (SkillDependentL.value) (inc) (instance as Record<SkillDependent>) as T

export const removePoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    isAttributeDependent (instance)
    ? over (AttributeDependentL.value) (dec) (instance) as T
    : isActivatableSkillDependent (instance)
    ? over (ActivatableSkillDependentL.value) (dec) (instance) as T
    : over (SkillDependentL.value) (dec) (instance as Record<SkillDependent>) as T

export const getBaseValueByCategory =
  (current_category: IncreasableCategory) => {
    switch (current_category) {
      case Categories.ATTRIBUTES:
        return 8

      case Categories.COMBAT_TECHNIQUES:
        return 6

      case Categories.LITURGIES:
        return 0

      case Categories.SPELLS:
        return 0

      case Categories.TALENTS:
        return 0
    }
  }

const { category, ic } = SkillG
const { value } = SkillDependentG

const getValueFromHeroStateEntry =
  (wikiEntry: IncreasableEntry) =>
  (maybeEntry: Maybe<ValueBasedDependent>) =>
    fromMaybe (getBaseValueByCategory (category (wikiEntry as Record<Skill>)))
              (fmap (value) (maybeEntry))

export const getAreSufficientAPAvailableForIncrease =
  <T extends ValueBasedDependent>
  (wikiEntry: IncreasableEntry) =>
  (instance: Maybe<T>) =>
  (availableAP: number) =>
  (negativeApValid: boolean): boolean =>
    getAreSufficientAPAvailable (negativeApValid)
                                (availableAP)
                                (getIncreaseAP (isAttribute (wikiEntry) ? 5 : ic (wikiEntry))
                                               (getValueFromHeroStateEntry (wikiEntry) (instance)))
