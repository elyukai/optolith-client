import { ExperienceLevel, type ExperienceLevel_ID } from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Database } from "../database.ts"
import type { Character } from "./character.ts"

export class CharacterExperienceLevel {
  readonly #db: Database
  readonly #character: Character

  @observable accessor id: ExperienceLevel_ID

  constructor(db: Database, character: Character, id: ExperienceLevel_ID) {
    this.#db = db
    this.#character = character
    this.id = id
  }

  @computed
  get start(): ExperienceLevel | undefined {
    return this.#db.getInstanceOfEntityById("ExperienceLevel", this.id)
  }

  @computed
  get current(): ExperienceLevel | undefined {
    return this.#db
      .getAllInstancesOfEntity("ExperienceLevel")
      .sort((a, b) => a.adventure_points - b.adventure_points)
      .reduce(
        (acc, experienceLevel) =>
          experienceLevel.adventure_points <= this.#character.totalAdventurePoints
            ? experienceLevel
            : acc,
        this.start,
      )
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
