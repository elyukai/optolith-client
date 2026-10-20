import { ExperienceLevel, type ExperienceLevel_ID } from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Database } from "../database.ts"

export class CharacterExperienceLevel {
  #db: Database
  @observable accessor id: ExperienceLevel_ID

  constructor(db: Database, id: ExperienceLevel_ID) {
    this.#db = db
    this.id = id
  }

  @computed
  get base(): ExperienceLevel | undefined {
    return this.#db.getInstanceOfEntityById("ExperienceLevel", this.id)
  }
}

/**
 * Returns the current experience level based on the total adventure points.
 */
export const getCurrentExperienceLevel = (
  experienceLevels: Record<number, ExperienceLevel>,
  totalAdventurePoints: number,
) =>
  Object.values(experienceLevels)
    .sort((a, b) => a.adventure_points - b.adventure_points)
    .reduce(
      (acc, experienceLevel) =>
        experienceLevel.adventure_points <= totalAdventurePoints ? experienceLevel : acc,
      experienceLevels[0],
    )
