import { createSelector } from "@reduxjs/toolkit"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { getCurrentExperienceLevel } from "../../shared/domain/experienceLevel.ts"
import {
  selectExperienceLevelStartId,
  selectTotalAdventurePoints,
} from "../slices/characterSlice.ts"
import { selectExperienceLevels } from "../slices/databaseSlice.ts"

export const selectStartExperienceLevel = createSelector(
  selectExperienceLevels,
  selectExperienceLevelStartId,
  (experienceLevels, experienceLevelStartId): ExperienceLevel | undefined =>
    experienceLevelStartId === undefined ? undefined : experienceLevels[experienceLevelStartId],
)

export const selectCurrentExperienceLevel = createSelector(
  selectExperienceLevels,
  selectTotalAdventurePoints,
  (experienceLevels, totalAdventurePoints): ExperienceLevel | undefined =>
    totalAdventurePoints === undefined
      ? undefined
      : getCurrentExperienceLevel(experienceLevels, totalAdventurePoints),
)

export const selectMaximumTotalAttributePoints = createSelector(
  selectStartExperienceLevel,
  (experienceLevel): number => experienceLevel?.max_attribute_total ?? 0,
)
