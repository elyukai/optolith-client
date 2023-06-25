import { createSelector } from "@reduxjs/toolkit"
import { Skill } from "optolith-database-schema/types/Skill"
import { AdvantageIdentifier } from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { getSkillCommonness, getSkillMaximum, getSkillMinimum, isSkillDecreasable, isSkillIncreasable } from "../../shared/domain/skill.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectAdvantages, selectAttributes, selectSkills as selectDynamicSkills } from "../slices/characterSlice.ts"
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
  selectCurrentCulture,
  (
    skills,
    dynamicSkills,
    attributes,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    culture,
  ): DisplayedSkill[] =>
    Object.values(skills)
      .sort((a, b) => a.id - b.id)
      .map(skill => {
        const dynamicSkill =
          dynamicSkills[skill.id] ?? createInitialDynamicSkill(skill.id)

        const minimum = getSkillMinimum()

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
          isDecreasable:
            isSkillDecreasable(
              dynamicSkill,
              minimum,
              canRemove,
            ),
          isIncreasable:
            isSkillIncreasable(
              dynamicSkill,
              maximum,
            ),
          commonness: culture === undefined ? undefined : getSkillCommonness(culture, skill),
        }
      })
)
