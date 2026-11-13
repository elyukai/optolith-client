import { on } from "@elyukai/utils/function"
import { compareNumber } from "@elyukai/utils/ordering"
import type {
  ActivatableIdentifier,
  PersonalityTrait,
  PersonalityTrait_ID,
} from "@optolith/database-schema/gen"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { BaseCharacter } from "./character.ts"
import type { Case } from "./databaseEnum.ts"
import { checkMultipleDisjunctionPartsAreValid } from "./prerequisites/disjunctionPrerequisiteMultipartValidation.ts"

export type PersonalityTraitDependency = {
  /**
   * The identifier of the dependency source.
   */
  sourceId: ActivatableIdentifier | Case<"PersonalityTrait", PersonalityTrait_ID>

  /**
   * The identifier of the personality trait that is depended on.
   */
  id: PersonalityTrait_ID

  /**
   * Indicates whether the target personality trait must be active or inactive for the dependency to be satisfied.
   */
  active: boolean

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean
}

export class CharacterPersonalityTraits {
  readonly global: Global
  readonly character: BaseCharacter
  readonly personalityTraitsByLevel: Map<number, { id: string; content: PersonalityTrait }[]>

  constructor(global: Global, character: BaseCharacter) {
    this.global = global
    this.character = character
    const pts = this.global.db.getAllInstanceContainersOfEntity("PersonalityTrait")
    this.personalityTraitsByLevel = new Map<number, { id: string; content: PersonalityTrait }[]>()
    for (const pt of pts) {
      const list = this.personalityTraitsByLevel.getOrInsert(pt.content.level, [])
      list.push({ id: pt.id, content: pt.content })
    }
  }

  @observable accessor activeByLevel: Map<number, PersonalityTrait_ID> = new Map()
  @observable accessor dependencies: PersonalityTraitDependency[] = []

  copyFrom(other: CharacterPersonalityTraits): void {
    for (const [level, id] of other.activeByLevel) {
      this.activeByLevel.set(level, id)
    }
    this.dependencies.push(...other.dependencies)
  }

  isActive(id: PersonalityTrait_ID): boolean {
    return this.activeByLevel.values().some(traitId => traitId === id)
  }

  activate(id: PersonalityTrait_ID, level: number): void {
    this.activeByLevel.set(level, id)
  }

  deactivate(id: PersonalityTrait_ID): void {
    for (const [level, traitId] of this.activeByLevel) {
      if (traitId === id) {
        this.activeByLevel.delete(level)
      }
    }
  }

  @computed
  get forDisplay(): DisplayedPersonalityTraitSlot[] {
    const deps = this.applyingDependencies
    const { translateMap, compare } = this.global.locale
    return this.personalityTraitsByLevel
      .entries()
      .map(([level, traits]): DisplayedPersonalityTraitSlot => {
        const active = this.activeByLevel.get(level)
        return {
          level,
          active,
          options: traits
            .filter(
              trait =>
                !deps.some(dep => !dep.active && dep.id === trait.id) &&
                isEntryFromIncludedPublication(
                  trait.content,
                  this.global.db.getInstanceOfEntityById.bind(this.global.db),
                  this.global.locale.translateMap,
                  this.character.rules.publicationOptions,
                ),
            )
            .map(({ id, content }) => ({
              id,
              name: translateMap(content.translations)?.name ?? MISSING_VALUE,
            }))
            .toSorted(on(entry => entry.name, compare)),
          isDisabled: deps.some(dep => dep.active && dep.id === active),
        }
      })
      .toArray()
      .toSorted(on(entry => entry.level, compareNumber))
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): PersonalityTraitDependency[] {
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

export type DisplayedPersonalityTraitSlot = {
  level: number
  active: PersonalityTrait_ID | undefined
  options: { id: PersonalityTrait_ID; name: string }[]
  isDisabled: boolean
}
