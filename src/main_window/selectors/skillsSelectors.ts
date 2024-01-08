import { createSelector } from "@reduxjs/toolkit"
import { Skill } from "optolith-database-schema/types/Skill"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
} from "../../shared/domain/identifier.ts"
import { getHighestAttributeValue } from "../../shared/domain/rated/attribute.ts"
import { Rated } from "../../shared/domain/rated/ratedEntry.ts"
import { getSkillCommonness } from "../../shared/domain/rated/skill.ts"
import {
  getSkillMaximum,
  getSkillMinimum,
  isSkillDecreasable,
  isSkillIncreasable,
} from "../../shared/domain/rated/skillBounds.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectDynamicAdvantages,
  selectDynamicGeneralSpecialAbilities,
} from "../slices/characterSlice.ts"
import { createInitialDynamicSkill } from "../slices/skillsSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"

/**
 * A combination of a static and corresponding dynamic skill entry, extended by
 * value bounds, full logic for if the value can be increased or decreased, and
 * commonness based on the selected culture.
 */
export type DisplayedSkill = {
  static: Skill
  dynamic: Rated
  minimum: number
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  commonness?: "common" | "uncommon"
}

/**
 * Returns all skills with their corresponding dynamic skill entries, extended
 * by value bounds, full logic for if the value can be increased or decreased,
 * and commonness based on the selected culture.
 */
export const selectVisibleSkills = createSelector(
  SelectAll.Static.Skills,
  SelectGetById.Dynamic.Skill,
  SelectGetById.Dynamic.Attribute,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(
    selectDynamicGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.CraftInstruments,
  ),
  selectCurrentCulture,
  selectFilterApplyingRatedDependencies,
  (
    staticSkills,
    getDynamicSkillById,
    getDynamicAttributeById,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    craftInstruments,
    culture,
    filterApplyingDependencies,
  ): DisplayedSkill[] =>
    staticSkills.map(skill => {
      const dynamicSkill = getDynamicSkillById(skill.id) ?? createInitialDynamicSkill(skill.id)

      const minimum = getSkillMinimum(
        getDynamicSkillById,
        dynamicSkill,
        craftInstruments,
        filterApplyingDependencies,
      )

      const maximum = getSkillMaximum(
        refs => getHighestAttributeValue(getDynamicAttributeById, refs),
        skill,
        isInCharacterCreation,
        startExperienceLevel,
        exceptionalSkill,
      )

      return {
        static: skill,
        dynamic: dynamicSkill,
        minimum,
        maximum,
        isDecreasable: isSkillDecreasable(dynamicSkill, minimum, canRemove),
        isIncreasable: isSkillIncreasable(dynamicSkill, maximum),
        commonness: culture === undefined ? undefined : getSkillCommonness(culture, skill),
      }
    }),
)
