import { on } from "@elyukai/utils/function"
import { ensure } from "@elyukai/utils/nullable"
import { compareNumber } from "@elyukai/utils/ordering"
import { sign } from "@elyukai/utils/string/number"
import type { Race as RawRace } from "@optolith/character-schema/types"
import type {
  ActivatableIdentifier,
  Attribute_ID,
  Race,
  Race_ID,
  RaceVariant,
  RaceVariant_ID,
} from "@optolith/database-schema/gen"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { BaseCharacter } from "./character.ts"

export class CharacterRace {
  readonly global: Global
  character: BaseCharacter

  /**
   * The base race identifier.
   */
  @computed
  get id(): Race_ID | undefined {
    return this.variant?.race
  }

  /**
   * The race variant identifier.
   */
  @observable accessor variantId: RaceVariant_ID

  /**
   * The identifier of the attribute adjustment that has been selected from the race.
   */
  @observable accessor selectedAttributeAdjustmentId: Attribute_ID | undefined

  /**
   * Dependencies on the selected race.
   */
  @observable accessor dependencies: RaceDependency[]

  constructor(
    global: Global,
    character: BaseCharacter,
    ...args:
      | [raw: RawRace]
      | [
          variantId: RaceVariant_ID,
          selectedAttributeAdjustmentId: Attribute_ID | undefined,
          dependencies: RaceDependency[],
        ]
  ) {
    this.global = global
    this.character = character
    this.variantId = typeof args[0] === "string" ? args[0] : args[0].variant
    this.selectedAttributeAdjustmentId =
      typeof args[0] === "string" ? args[1] : args[0].selectedAttributeAdjustment
    this.dependencies = typeof args[0] === "string" ? (args[2] ?? []) : []
  }

  @computed
  get base(): Race | undefined {
    return this.id === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("Race", this.id)
  }

  @computed
  get adventurePoints(): number {
    return this.base?.ap_value ?? 0
  }

  @computed
  get baseName(): string | undefined {
    return this.global.locale.translateMap(this.base?.translations)?.name
  }

  @computed
  get variant(): RaceVariant | undefined {
    return this.global.db.getInstanceOfEntityById("RaceVariant", this.variantId)
  }

  @computed
  get variantName(): string | undefined {
    return this.global.locale.translateMap(this.variant?.translations)?.name
  }

  @computed
  get fullName(): string | undefined {
    if (this.baseName === undefined) {
      return undefined
    }
    return this.baseName + parensIf(this.variantName)
  }

  static getRacesForDisplay(character: BaseCharacter): RaceForDisplay[] {
    return character.global.db
      .getAllInstanceContainersOfEntity("Race")
      .filter(race =>
        isEntryFromIncludedPublication(
          race.content,
          character.global.db.getInstanceOfEntityById.bind(character.global.db),
          character.global.locale.translateMap,
          character.rules.publicationOptions,
        ),
      )
      .map(race => ({
        id: race.id,
        name: character.global.locale.translateMap(race.content.translations)?.name ?? race.id,
        apValue: race.content.ap_value,
        variantId:
          character.global.db
            .getAllChildInstanceContainersForParent("RaceVariant", race.id)
            .toSorted(
              on(
                rv => character.global.locale.translateMap(rv.content.translations)?.name ?? "",
                character.global.locale.compare,
              ),
            )[0]?.id ?? race.id,
      }))
  }

  @computed
  get raceVariantsForDisplay(): RaceVariantForDisplay[] {
    return this.id === undefined
      ? []
      : (ensure(
          this.global.db.getAllChildInstanceContainersForParent("RaceVariant", this.id),
          list => list.length > 1,
        )
          ?.map(raceVariant => ({
            id: raceVariant.id,
            name:
              this.global.locale.translateMap(raceVariant.content.translations)?.name ??
              raceVariant.id,
          }))
          .toSorted(on(rv => rv.name, this.global.locale.compare)) ?? [])
  }

  @computed
  get selectOptions(): DisplayedRaceSelectOptions {
    const attributeAdjustment = this.variant?.attribute_adjustments.selectable?.[0]
    return {
      attributeAdjustment: attributeAdjustment?.list
        .map(attr => {
          const entry = this.global.db.getInstanceOfEntityById("Attribute", attr)
          return {
            id: attr,
            name: `${
              this.global.locale.translateMap(entry?.translations)?.name ?? MISSING_VALUE
            } ${sign(attributeAdjustment.value)}`,
            position: entry?.position ?? 0,
          }
        })
        .toSorted(on(attr => attr.position, compareNumber)),
    }
  }

  toJSON(): RawRace {
    return {
      base: this.id ?? this.variantId,
      variant: this.variantId,
      selectedAttributeAdjustment: this.selectedAttributeAdjustmentId,
    }
  }
}

export type DisplayedRaceSelectOptions = {
  attributeAdjustment?: { id: Attribute_ID; name: string }[]
}

export type RaceForDisplay = Readonly<{
  id: Race_ID
  name: string
  apValue: number
  variantId: RaceVariant_ID
}>

export type RaceVariantForDisplay = Readonly<{
  id: RaceVariant_ID
  name: string
}>

/**
 * A dependency on a race.
 */
export type RaceDependency = Readonly<{
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

  /**
   * The required race's identifier.
   */
  id: Race_ID

  /**
   * Whether the required race is required to be active or inactive.
   */
  active: boolean
}>
