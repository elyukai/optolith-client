import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"

export const getCurrentExperienceLevel = (
  experienceLevels: Record<number, ExperienceLevel>,
  totalAdventurePoints: number,
) =>
  Object.values(experienceLevels)
    .sort((a, b) => a.adventure_points - b.adventure_points)
    .reduce(
      (acc, experienceLevel) =>
        experienceLevel.adventure_points <= totalAdventurePoints
        ? experienceLevel
        : acc,
      experienceLevels[0]
    )
