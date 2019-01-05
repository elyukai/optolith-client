import { ActivatableSkillDependentL, isActivatableSkillDependent } from "../App/Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependentL, isAttributeDependent } from "../App/Models/ActiveEntries/AttributeDependent";
import { SkillDependent, SkillDependentL } from "../App/Models/ActiveEntries/SkillDependent";
import { Skill } from "../App/Models/Wiki/Skill";
import { IncreasableEntry } from "../App/Models/Wiki/wikiTypeHelpers";
import { Categories } from "../constants/Categories";
import { Lens, over } from "../Data/Lens";
import { fmap, fromMaybe, Maybe } from "../Data/Maybe";
import { Record } from "../Data/Record";
import { ValueBasedDependent } from "../types/data";
import { getAreSufficientAPAvailable } from "./adventurePoints/adventurePointsUtils";
import { getIncreaseAP } from "./adventurePoints/improvementCostUtils";
import { dec, inc } from "./mathUtils";
import { isAttribute } from "./WikiUtils";

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
  (current_category: Categories) => {
    switch (current_category) {
      case Categories.ATTRIBUTES:
        return 8

      case Categories.COMBAT_TECHNIQUES:
        return 6

      default:
        return 0
    }
  }

const { category, ic } = Skill.A
const { value } = SkillDependent.A

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
