import type { ExperienceLevel, ExperienceLevel_ID } from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { Character } from "./character.ts"

export class CharacterExperienceLevel {
  readonly global: Global
  readonly #character: Character

  @observable accessor startId: ExperienceLevel_ID

  constructor(global: Global, character: Character, id: ExperienceLevel_ID) {
    this.global = global
    this.#character = character
    this.startId = id
  }

  @computed
  get start(): ExperienceLevel | undefined {
    return this.global.db.getInstanceOfEntityById("ExperienceLevel", this.startId)
  }

  @computed
  get #currentWithId(): { id: string; content: ExperienceLevel } | undefined {
    return this.global.db
      .getAllInstanceContainersOfEntity("ExperienceLevel")
      .toSorted((a, b) => a.content.adventure_points - b.content.adventure_points)
      .reduce(
        (acc, experienceLevel) =>
          experienceLevel.content.adventure_points <= this.#character.totalAdventurePoints
            ? { id: experienceLevel.id, content: experienceLevel.content }
            : acc,
        this.start === undefined ? undefined : { id: this.startId, content: this.start },
      )
  }

  @computed
  get current(): ExperienceLevel | undefined {
    return this.#currentWithId?.content
  }

  @computed
  get currentId(): ExperienceLevel_ID {
    return this.#currentWithId?.id ?? this.startId
  }
}
