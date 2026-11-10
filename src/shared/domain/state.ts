import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import type { ActivatableIdentifier, State, State_ID } from "@optolith/database-schema/gen"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { BaseCharacter } from "./character.ts"
import {
  addOrRemoveDependency,
  type RegistrationMethod,
} from "./dependencies/registrationHelpers.ts"
import { checkMultipleDisjunctionPartsAreValid } from "./prerequisites/disjunctionPrerequisiteMultipartValidation.ts"

export class CharacterState {
  readonly global: Global
  readonly character: BaseCharacter
  readonly id: string
  readonly dbEntry: State
  @observable accessor active = false
  @observable accessor dependencies: StateDependency[] = []

  constructor(global: Global, character: BaseCharacter, id: string, dbEntry: State) {
    this.global = global
    this.character = character
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
      disabled: isNotEmpty(this.applyingDependencies),
    }
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): StateDependency[] {
    return this.dependencies.filter(dep => {
      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(
          this.global.db.getInstanceOfEntityById,
          this.character.prerequisiteCapabilities,
          dep.sourceId,
          dep.index,
        )
      }

      return true
    })
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
  readonly character: BaseCharacter

  @observable accessor #states: Map<State_ID, CharacterState> = new Map()

  constructor(global: Global, character: BaseCharacter) {
    this.global = global
    this.character = character
    for (const state of global.db.getAllInstanceContainersOfEntity("State")) {
      this.#states.set(state.id, new CharacterState(global, character, state.id, state.content))
    }
  }

  isActive(id: State_ID): boolean {
    return this.#states.get(id)?.active ?? false
  }

  getById(id: State_ID): CharacterState | undefined {
    return this.#states.get(id)
  }

  getAll(): DisplayedState[] {
    return this.#states
      .values()
      .filter(state =>
        isEntryFromIncludedPublication(
          state.dbEntry,
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.character.rules.publicationOptions,
        ),
      )
      .map(container => container.toJSON())
      .toArray()
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: StateDependency) {
    const entry = this.getById(id)
    if (entry) {
      addOrRemoveDependency(method, entry.dependencies, dependency)
    }
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
