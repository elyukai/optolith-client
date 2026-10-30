import type { ActivatableIdentifier, State, State_ID } from "@optolith/database-schema/gen"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { observable } from "mobx"
import type { Global } from "../global.ts"
import type { Character } from "./character.ts"
import {
  addOrRemoveDependency,
  type RegistrationMethod,
} from "./dependencies/registrationHelpers.ts"

export class CharacterState {
  readonly global: Global
  readonly id: string
  readonly dbEntry: State
  @observable accessor active: boolean = false
  @observable accessor dependencies: StateDependency[] = []

  constructor(
    global: Global,
    id: string,
    dbEntry: State | undefined = global.db.getInstanceOfEntityById("State", id),
  ) {
    this.global = global
    this.id = id
    if (!dbEntry) {
      throw new Error(`State with id ${id} not found in database.`)
    }
    this.dbEntry = dbEntry
  }

  toJSON(): DisplayedState {
    return {
      id: this.id,
      dbEntry: this.dbEntry,
      active: this.active,
      disabled: false, // TODO
    }
  }
}

export type DisplayedState = {
  id: State_ID
  dbEntry: State
  active: boolean
  disabled: boolean
}

export class CharacterStates {
  readonly global: Global
  readonly character: Character

  @observable accessor #states: Map<State_ID, CharacterState> = new Map()

  constructor(global: Global, character: Character) {
    this.global = global
    this.character = character
  }

  isActive(id: State_ID): boolean {
    return this.#states.get(id)?.active ?? false
  }

  getById(id: State_ID): CharacterState | undefined {
    return this.#states.get(id)
  }

  getAll(): DisplayedState[] {
    return this.global.db
      .getAllInstanceContainersOfEntity("State")
      .filter(state =>
        isEntryFromIncludedPublication(
          state.content,
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.character.rules.publicationOptions,
        ),
      )
      .map(container => {
        const entry =
          this.getById(container.id) ??
          new CharacterState(this.global, container.id, container.content)

        return entry.toJSON()
      })
  }

  #ensureEntryExists(id: string): CharacterState {
    return this.#states.getOrInsertComputed(id, () => new CharacterState(this.global, id))
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: StateDependency) {
    const entry = this.#ensureEntryExists(id)
    addOrRemoveDependency(method, entry.dependencies, dependency)
  }
}

/**
 * A dependency on a state.
 */
export type StateDependency = {
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
}
