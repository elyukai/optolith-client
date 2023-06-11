import { createSelector } from "@reduxjs/toolkit"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { selectExperienceLevelStartId, selectTotalAdventurePoints } from "../slices/characterSlice.ts"
import { selectExperienceLevels } from "../slices/databaseSlice.ts"

export const selectStartExperienceLevel = createSelector(
  selectExperienceLevels,
  selectExperienceLevelStartId,
  (experienceLevels, experienceLevelStartId): ExperienceLevel | undefined =>
    experienceLevelStartId === undefined ? undefined : experienceLevels[experienceLevelStartId]
)

export const selectCurrentExperienceLevel = createSelector(
  selectExperienceLevels,
  selectTotalAdventurePoints,
  (experienceLevels, totalAdventurePoints): ExperienceLevel | undefined =>
    totalAdventurePoints === undefined
    ? undefined
    : Object.values(experienceLevels)
      .sort((a, b) => a.adventure_points - b.adventure_points)
      .reduce(
        (acc, experienceLevel) =>
          experienceLevel.adventure_points <= totalAdventurePoints
          ? experienceLevel
          : acc,
        experienceLevels[0]
      )
)

export const selectMaximumTotalAttributePoints = createSelector(
  selectStartExperienceLevel,
  (experienceLevel): number => experienceLevel?.max_attribute_total ?? 0
)
