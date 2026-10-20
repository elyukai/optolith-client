import {
  ActivatableIdentifier,
  Race,
  RaceVariant,
  type Attribute_ID,
  type Race_ID,
  type RaceVariant_ID,
} from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Database } from "../database.ts"
import { mapNullableDefault } from "../utils/nullable.ts"
import { TranslateMap } from "../utils/translate.ts"

export class CharacterRace {
  readonly #db: Database

  /**
   * The base race identifier.
   */
  @observable accessor id: Race_ID

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
    db: Database,
    id: Race_ID,
    variantId: RaceVariant_ID,
    selectedAttributeAdjustmentId?: Attribute_ID | undefined,
    dependencies: RaceDependency[] = [],
  ) {
    this.#db = db
    this.id = id
    this.variantId = variantId
    this.selectedAttributeAdjustmentId = selectedAttributeAdjustmentId
    this.dependencies = dependencies
  }

  @computed
  get base(): Race | undefined {
    return this.#db.getInstanceOfEntityById("Race", this.id)
  }

  @computed
  get variant(): RaceVariant | undefined {
    return this.#db.getInstanceOfEntityById("RaceVariant", this.id)
  }
}

/**
 * Gets a race by id.
 */
export const getRace = (races: Record<number, Race>, id: number): Race | undefined => races[id]

/**
 * Gets a race variant by id, if any.
 */
export const getRaceVariant = (race: Race, id: number | undefined): RaceVariant | undefined =>
  id === undefined ? undefined : race.variants.find(variant => variant.id === id)

/**
 * Creates the full race name for the given race and optional race variant.
 */
export const getFullRaceName = (
  translateMap: TranslateMap,
  race: Race,
  raceVariant?: RaceVariant,
): string =>
  `${translateMap(race.translations)?.name ?? ""}${mapNullableDefault(
    translateMap(raceVariant?.translations)?.name,
    str => ` (${str})`,
    "",
  )}`

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
  id: number

  /**
   * Whether the required race is required to be active or inactive.
   */
  active: boolean
}>
