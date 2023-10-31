import { createSelector } from "@reduxjs/toolkit"
import { Skill } from "optolith-database-schema/types/Skill"
import { getHighestAttributeValue } from "../../shared/domain/attribute.ts"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { getSkillCommonness } from "../../shared/domain/skill.ts"
import {
  getSkillMaximum,
  getSkillMinimum,
  isSkillDecreasable,
  isSkillIncreasable,
} from "../../shared/domain/skillBounds.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicGeneralSpecialAbilities,
  selectDynamicSkills,
} from "../slices/characterSlice.ts"
import { selectStaticSkills } from "../slices/databaseSlice.ts"
import { createInitialDynamicSkill } from "../slices/skillsSlice.ts"
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
  selectStaticSkills,
  selectDynamicSkills,
  selectDynamicAttributes,
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
    skills,
    dynamicSkills,
    attributes,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    craftInstruments,
    culture,
    filterApplyingDependencies,
  ): DisplayedSkill[] =>
    Object.values(skills).map(skill => {
      const dynamicSkill = dynamicSkills[skill.id] ?? createInitialDynamicSkill(skill.id)

      const minimum = getSkillMinimum(
        id => dynamicSkills[id],
        dynamicSkill,
        craftInstruments,
        filterApplyingDependencies,
      )

      const maximum = getSkillMaximum(
        refs => getHighestAttributeValue(id => attributes[id], refs),
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
