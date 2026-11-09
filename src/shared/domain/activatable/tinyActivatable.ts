import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { count } from "@elyukai/utils/array/reductions"
import type {
  ActivatableIdentifier,
  EntityMap,
  TinyActivatableIdentifier,
} from "@optolith/database-schema/gen"
import { action, computed, observable } from "mobx"
import type { Global } from "../../global.ts"
import { AdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BaseCharacter, Character } from "../character.ts"
import {
  type RegistrationMethod,
  addOrRemoveDependency,
} from "../dependencies/registrationHelpers.ts"

/**
 * A dependency on a tiny activatable entry.
 */
export type TinyActivatableDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  sourceId: ActivatableIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean
}>

export abstract class TinyActivatable<Entity extends TinyActivatableIdentifier["kind"]> {
  readonly id: string
  @observable accessor active: boolean
  readonly entityName: Entity
  readonly dbEntry: EntityMap[Entity]
  readonly character: BaseCharacter
  @observable accessor dependencies: TinyActivatableDependency[] = []

  constructor(
    global: Global,
    character: BaseCharacter,
    id: string,
    entityName: Entity,
    dbEntry: EntityMap[Entity] | undefined = global.db.getInstanceOfEntityById(entityName, id),
    active: boolean = false,
  ) {
    this.id = id
    this.entityName = entityName
    if (!dbEntry) {
      throw new Error(
        `Tiny activatable entry of entity ${entityName} with id ${id} not found in database.`,
      )
    }
    this.dbEntry = dbEntry
    this.active = active
    this.character = character
  }

  @action
  activate() {
    this.active = true
  }

  @action
  deactivate() {
    this.active = false
  }
}

type TinyActivatableConstructor<
  Entity extends TinyActivatableIdentifier["kind"],
  T extends TinyActivatable<Entity>,
> = {
  new (
    global: Global,
    character: BaseCharacter,
    id: string,
    entityName: Entity,
    dbEntry?: EntityMap[Entity],
    active?: boolean,
  ): T
}

export abstract class TinyActivatables<
  Entity extends TinyActivatableIdentifier["kind"],
  T extends TinyActivatable<Entity>,
> {
  readonly global: Global
  readonly character: BaseCharacter
  readonly entityName: Entity
  readonly creator: TinyActivatableConstructor<Entity, T>
  @observable accessor activatables: Map<string, T> = new Map()

  constructor(
    global: Global,
    character: BaseCharacter,
    entityName: Entity,
    creator: TinyActivatableConstructor<Entity, T>,
  ) {
    this.global = global
    this.character = character
    this.entityName = entityName
    this.creator = creator
    for (const entry of this.global.db.getAllInstanceContainersOfEntity(entityName)) {
      this.activatables.set(
        entry.id,
        new this.creator(global, character, entry.id, entityName, entry.content),
      )
    }
  }

  getById(id: string): T | undefined {
    return this.activatables.get(id)
  }

  isActive(id: string): boolean {
    return this.activatables.get(id)?.active ?? false
  }

  @computed
  get activeCount(): number {
    return count(this.activatables.values().toArray(), entry => entry.active)
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return new AdventurePointsCache(this.activeCount, 0)
  }

  @action
  activate(id: string) {
    this.getById(id)?.activate()
  }

  @action
  deactivate(id: string) {
    this.getById(id)?.deactivate()
  }

  addOrRemoveDependency(
    id: string,
    method: RegistrationMethod,
    dependency: TinyActivatableDependency,
  ) {
    const entry = this.getById(id)
    if (entry) {
      addOrRemoveDependency(method, entry.dependencies, dependency)
    }
  }

  static fromAnyJSON<T extends TinyActivatables<any, TinyActivatable<any>>>(
    global: Global,
    character: Character,
    creator: new (global: Global, character: Character) => T,
    raw: string[] | undefined,
  ): T {
    const activatables = new creator(global, character)

    for (const id of raw ?? []) {
      activatables.activate(id)
    }

    return activatables
  }

  toJSON(): string[] | undefined {
    return ensureNonEmpty(
      this.activatables
        .values()
        .filter(entry => entry.active)
        .map(entry => entry.id)
        .toArray(),
    )
  }
}
