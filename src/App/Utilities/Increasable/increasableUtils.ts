import { fmap } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { fromMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ActivatableSkillDependentL, isActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependentL, isAttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { SkillDependent, SkillDependentL } from "../../Models/ActiveEntries/SkillDependent";
import { ValueBasedDependent } from "../../Models/Hero/heroTypeHelpers";
import { isAttribute } from "../../Models/Wiki/Attribute";
import { Skill } from "../../Models/Wiki/Skill";
import { IncreasableEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { getMissingAP } from "../AdventurePoints/adventurePointsUtils";
import { getIncreaseAP } from "../AdventurePoints/improvementCostUtils";
import { dec, inc } from "../mathUtils";

export const setPoints =
  <T extends ValueBasedDependent> (instance: T) => (x: number): T =>
    isAttributeDependent (instance)
    ? set (AttributeDependentL.value) (x) (instance) as T
    : isActivatableSkillDependent (instance)
    ? set (ActivatableSkillDependentL.value) (x) (instance) as T
    : set (SkillDependentL.value) (x) (instance as Record<SkillDependent>) as T

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

const { category, ic } = Skill.AL
const { value } = SkillDependent.AL

const getValueFromHeroStateEntry =
  (wikiEntry: IncreasableEntry) =>
  (maybeEntry: Maybe<ValueBasedDependent>) =>
    fromMaybe (getBaseValueByCategory (category (wikiEntry as Record<Skill>)))
              (fmap (value) (maybeEntry))

export const getAreSufficientAPAvailableForIncrease =
  (negativeApValid: boolean) =>
  <T extends ValueBasedDependent>
  (instance: Maybe<T>) =>
  (wikiEntry: IncreasableEntry) =>
    getMissingAP (negativeApValid)
                 (getIncreaseAP (isAttribute (wikiEntry) ? 5 : ic (wikiEntry))
                                (getValueFromHeroStateEntry (wikiEntry) (instance)))
