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
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"

export class CharacterRace {
  readonly global: Global

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
    variantId: RaceVariant_ID,
    selectedAttributeAdjustmentId?: Attribute_ID | undefined,
    dependencies: RaceDependency[] = [],
  ) {
    this.global = global
    this.variantId = variantId
    this.selectedAttributeAdjustmentId = selectedAttributeAdjustmentId
    this.dependencies = dependencies
  }

  @computed
  get base(): Race | undefined {
    return this.id === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("Race", this.id)
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

  static fromJSON(global: Global, raw: RawRace): CharacterRace {
    return new CharacterRace(global, raw.variant, raw.selectedAttributeAdjustment)
  }

  toJSON(): RawRace | undefined {
    if (this.id === undefined) {
      return undefined
    }

    return {
      base: this.id,
      variant: this.variantId,
      selectedAttributeAdjustment: this.selectedAttributeAdjustmentId,
    }
  }
}

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
