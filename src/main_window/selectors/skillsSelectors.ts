import { createSelector } from "@reduxjs/toolkit"
import { Skill } from "optolith-database-schema/types/Skill"
import { getHighestAttributeValue } from "../../shared/domain/attribute.ts"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
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
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicGeneralSpecialAbilities,
  selectDynamicLiturgicalChants,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicSkills,
  selectDynamicSpells,
} from "../slices/characterSlice.ts"
import { selectStaticSkills } from "../slices/databaseSlice.ts"
import { createInitialDynamicSkill } from "../slices/skillsSlice.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
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
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
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
    closeCombatTechniques,
    rangedCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    ceremonies,
  ): DisplayedSkill[] => {
    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes,
      skills: dynamicSkills,
      closeCombatTechniques,
      rangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants,
      ceremonies,
    })

    return Object.values(skills).map(skill => {
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
    })
  },
)
