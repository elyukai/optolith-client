import type { ExperienceLevel, ExperienceLevel_ID } from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { Character } from "./character.ts"

export class CharacterExperienceLevel {
  readonly global: Global
  readonly #character: Character

  @observable accessor id: ExperienceLevel_ID

  constructor(global: Global, character: Character, id: ExperienceLevel_ID) {
    this.global = global
    this.#character = character
    this.id = id
  }

  @computed
  get start(): ExperienceLevel | undefined {
    return this.global.db.getInstanceOfEntityById("ExperienceLevel", this.id)
  }

  @computed
  get current(): ExperienceLevel | undefined {
    return this.global.db
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
