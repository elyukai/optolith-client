import { createSelector } from "@reduxjs/toolkit"
import { Skill } from "optolith-database-schema/types/Skill"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import {
  getSkillCommonness,
  getSkillMaximum,
  getSkillMinimum,
  isSkillDecreasable,
  isSkillIncreasable,
} from "../../shared/domain/skill.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectAdvantages,
  selectAttributes,
  selectCeremonies,
  selectCloseCombatTechniques,
  selectSkills as selectDynamicSkills,
  selectGeneralSpecialAbilities,
  selectLiturgicalChants,
  selectRangedCombatTechniques,
  selectRituals,
  selectSpells,
} from "../slices/characterSlice.ts"
import { selectSkills as selectStaticSkills } from "../slices/databaseSlice.ts"
import { createInitialDynamicSkill } from "../slices/skillsSlice.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"

export type DisplayedSkill = {
  static: Skill
  dynamic: Rated
  minimum: number
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  commonness?: "common" | "uncommon"
}

export const selectVisibleSkills = createSelector(
  selectStaticSkills,
  selectDynamicSkills,
  selectAttributes,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(
    selectGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.CraftInstruments,
  ),
  selectCurrentCulture,
  selectCloseCombatTechniques,
  selectRangedCombatTechniques,
  selectSpells,
  selectRituals,
  selectLiturgicalChants,
  selectCeremonies,
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
        dynamicSkills,
        dynamicSkill,
        craftInstruments,
        filterApplyingDependencies,
      )

      const maximum = getSkillMaximum(
        attributes,
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
