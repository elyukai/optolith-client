import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { mapObject } from "@elyukai/utils/object"
import { reduceCompare, type Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Activatable as RawActivatable } from "@optolith/character-schema/types"
import type { SpecialAbilityIdentifier as SpecialAbilityIdentifierType } from "@optolith/database-schema/gen"
import { SpecialAbilityIdentifier } from "@optolith/database-schema/types/_IdentifierGroup"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { computed, observable } from "mobx"
import type { Global } from "../../global.ts"
import type { Translate, TranslateMap } from "../../utils/locale.ts"
import { ensureNonEmptyObject } from "../../utils/object.ts"
import { addAdventurePointsCaches, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import type { Character } from "../character.ts"
import { fromUniformCase } from "../databaseEnum.ts"
import type { AnySpecialAbilityOfGroupDependency } from "../dependencies/single/anySpecialAbilityOfGroup.ts"
import { SpecialAbilitiesSortOrder } from "../sortOrders.ts"
import {
  activatableGroupTranslationKeys,
  CharacterActivatables,
  type DisplayedActiveActivatable,
  type DisplayedInactiveActivatable,
  type SerializedActivatableInstance,
} from "./activatable.ts"

export class CharacterSpecialAbilities {
  readonly #specialAbilities: {
    [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
  }

  @observable accessor dependencies: AnySpecialAbilityOfGroupDependency[]

  constructor(global: Global, character: Character) {
    this.#specialAbilities = mapObject(
      SpecialAbilityIdentifier.type.value.values,
      (_value, key) => new CharacterActivatables(global, character, key),
    ) as {
      [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
    }
    this.dependencies = []
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#specialAbilities).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePointsTotal),
      emptyAdventurePointsCache,
    )
  }

  @computed
  get active(): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] =>
        entry.activeForDisplay,
    )
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] =>
        entry.inactive,
    )
  }

  getSpecialAbilitiesCollection<Entity extends SpecialAbilityIdentifierType["kind"]>(
    entity: Entity,
  ): CharacterActivatables<Entity> {
    return this.#specialAbilities[entity]
  }

  add(id: SpecialAbilityIdentifierType, instance: SerializedActivatableInstance): void {
    this.#specialAbilities[id.kind].add(fromUniformCase(id), instance)
  }

  remove(id: SpecialAbilityIdentifierType, index: number): void {
    this.#specialAbilities[id.kind].remove(fromUniformCase(id), index)
  }

  static fromJSON(
    global: Global,
    character: Character,
    raw: {
      [Entity in SpecialAbilityIdentifierType["kind"]]?: Record<string, RawActivatable>
    },
  ): CharacterSpecialAbilities {
    const specialAbilities = new CharacterSpecialAbilities(global, character)

    for (const [kind, entries] of Object.entries(raw)) {
      if (kind in specialAbilities.#specialAbilities) {
        const typedKind = kind as SpecialAbilityIdentifierType["kind"]
        ;(specialAbilities.#specialAbilities[typedKind] as CharacterActivatables<
          typeof typedKind
        >) = CharacterActivatables.fromJSON(global, character, typedKind, entries)
      }
    }

    return specialAbilities
  }

  toJSON():
    | {
        [Entity in SpecialAbilityIdentifierType["kind"]]?: Record<string, RawActivatable>
      }
    | undefined {
    return ensureNonEmptyObject(mapObject(this.#specialAbilities, entry => entry.toJSON()))
  }
}

/**
 * Filters and sorts the displayed special abilities.
 */
export const filterAndSortDisplayed = <
  T extends
    | DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>
    | DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  sortOrder: SpecialAbilitiesSortOrder,
  showEntriesWithoutMetPrerequisites: boolean,
  translate: Translate,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T): string =>
    typeof c.name === "string" ? c.name : renderActivatableNameChunk(translateMap, c.name.full)

  const filters = ensureNonEmpty(
    [
      filterText === ""
        ? undefined
        : (c: T) => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
      showEntriesWithoutMetPrerequisites ? undefined : (c: T) => c.active || c.isAvailable,
    ].filter(isNotNullish),
  )

  return (
    filters === undefined
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(entry => filters.every(filter => filter(entry)))
  ).toSorted(
    (() => {
      switch (sortOrder) {
        case SpecialAbilitiesSortOrder.Name:
          return on(getName, localeCompare)
        case SpecialAbilitiesSortOrder.Group:
          return reduceCompare(
            on(x => translate(activatableGroupTranslationKeys[x.type] ?? ""), localeCompare),
            on(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}
