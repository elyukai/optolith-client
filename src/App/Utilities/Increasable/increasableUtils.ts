import { fmap } from "../../../Data/Functor"
import { over } from "../../../Data/Lens"
import { fromMaybe, Maybe } from "../../../Data/Maybe"
import { dec, inc } from "../../../Data/Num"
import { Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { icFromJs } from "../../Constants/Groups"
import { ActivatableSkillDependentL, isActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependentL, isAttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { SkillDependent, SkillDependentL } from "../../Models/ActiveEntries/SkillDependent"
import { ValueBasedDependent } from "../../Models/Hero/heroTypeHelpers"
import { isAttribute } from "../../Models/Wiki/Attribute"
import { Skill } from "../../Models/Wiki/Skill"
import { IncreasableEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { getMissingAP } from "../AdventurePoints/adventurePointsUtils"
import { getAPForInc } from "../IC.gen"

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
  (current_category: Category) => {
    switch (current_category) {
      case Category.ATTRIBUTES:
        return 8

      case Category.COMBAT_TECHNIQUES:
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
                 (getAPForInc (
                   isAttribute (wikiEntry) ? "E" : icFromJs (ic (wikiEntry)),
                   getValueFromHeroStateEntry (wikiEntry) (instance)
                 ))
