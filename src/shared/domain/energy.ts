import { on } from "@elyukai/utils/function"
import { compareNumber } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type {
  Attribute_ID,
  DerivedCharacteristic,
  DerivedCharacteristic_ID,
  DerivedCharacteristicBase,
} from "@optolith/database-schema/gen"
import { evaluateMathOperation } from "@optolith/entity-descriptions/entities/partial/mathOperation"
import { action, computed, observable } from "mobx"
import type { Database } from "../database.ts"
import { get } from "../mobxTyped.ts"
import {
  addAdventurePointsCaches,
  emptyAdventurePointsCache,
  type AdventurePointsCache,
} from "./adventurePoints/cache.ts"
import { cachedAdventurePoints } from "./adventurePoints/ratedEntry.ts"
import type { Character } from "./character.ts"

/**
 * The instance of an energy entry where points can be purchased but also
 * (permanently) spent.
 */
export type Energy = {
  /**
   * The number of points purchased.
   */
  readonly purchased: number

  /**
   * The number of points permanently lost.
   */
  readonly permanentlyLost: number
}

/**
 * The instance of an energy entry where points can be purchased but also
 * (permanently) spent and bought back.
 */
export type EnergyWithBuyBack = {
  /**
   * The number of points purchased.
   */
  readonly purchased: number

  /**
   * The number of points permanently lost.
   */
  readonly permanentlyLost: number

  /**
   * The number of permanently lost points that have been bought back.
   */
  readonly permanentlyLostBoughtBack: number
}

export type DisplayedDerivedCharacteristicBase = {
  id: string
  base: number
  value: number
  modifier: number
  purchaseMaximum?: number
  purchased?: number
  isPurchasedIncreasable?: boolean
  isPurchasedDecreasable?: boolean
  permanentlyLost?: number
  permanentlyLostBoughtBack?: number
}

export type DisplayedDerivedCharacteristic = DisplayedDerivedCharacteristicBase &
  DerivedCharacteristic

export class CharacterDerivedCharacteristic {
  declare ["constructor"]: typeof CharacterDerivedCharacteristic

  static readonly improvementCost: ImprovementCost = "D"

  readonly #character: Character

  readonly id: string
  readonly dbEntry: DerivedCharacteristic
  @observable accessor #purchased: number | undefined
  @observable accessor #permanentlyLost: number | undefined
  @observable accessor #permanentlyLostBoughtBack: number | undefined

  constructor(id: string, dbEntry: DerivedCharacteristic, character: Character) {
    this.id = id
    this.dbEntry = dbEntry
    this.#character = character

    if (dbEntry.type?.kind === "Energy") {
      if (dbEntry.type.Energy.purchase) {
        this.#purchased = 0
      }

      if (dbEntry.type.Energy.permanentLoss) {
        this.#permanentlyLost = 0

        if (dbEntry.type.Energy.permanentLoss.canBeBoughtBack) {
          this.#permanentlyLostBoughtBack = 0
        }
      }
    }
  }

  static createEmpty(
    id: string,
    dbEntry: DerivedCharacteristic | undefined,
    character: Character,
  ): CharacterDerivedCharacteristic {
    if (!dbEntry) {
      throw new Error(`DerivedCharacteristic with id ${id} not provided.`)
    }
    return new CharacterDerivedCharacteristic(id, dbEntry, character)
  }

  #calculateBaseValue(baseValue: DerivedCharacteristicBase) {
    return Math.round(
      evaluateMathOperation(baseValue, value => {
        switch (value.kind) {
          case "Attribute":
            return this.#character.attributes.getValueById(value.Attribute)
          case "Constant":
            return value.Constant
          case "PrimaryAttribute":
            switch (value.PrimaryAttribute.kind) {
              case "Blessed":
                // TODO
                return 0
              case "Magical":
                // TODO
                return 0
              default:
                return assertExhaustive(value.PrimaryAttribute)
            }
          case "RaceBaseValue":
            return this.#character.race?.base?.base_values?.[this.id]?.value ?? 0
          default:
            return assertExhaustive(value)
        }
      }),
    )
  }

  @computed
  get base() {
    return this.#calculateBaseValue(this.dbEntry.calculation.base)
  }

  @computed
  get modifier() {
    // TODO
    return 0
  }

  @computed
  get value() {
    return (
      this.base +
      this.modifier +
      (this.purchased ?? 0) -
      (this.permanentlyLost ?? 0) +
      (this.permanentlyLostBoughtBack ?? 0)
    )
  }

  @computed
  get purchased(): number | undefined {
    return this.#purchased
  }

  @action
  setPurchased(value: number) {
    this.#purchased = Math.max(0, value)
  }

  @action
  updatePurchased(fn: (value: number) => number) {
    if (this.#purchased !== undefined) {
      this.setPurchased(fn(this.#purchased))
    }
  }

  @computed
  get permanentlyLost(): number | undefined {
    return this.#permanentlyLost
  }

  @action
  setPermanentlyLost(value: number) {
    this.#permanentlyLost = Math.max(0, value)
  }

  @action
  updatePermanentlyLost(fn: (value: number) => number) {
    if (this.#permanentlyLost !== undefined) {
      this.setPermanentlyLost(fn(this.#permanentlyLost))
    }
  }

  @computed
  get permanentlyLostBoughtBack(): number | undefined {
    return this.#permanentlyLostBoughtBack
  }

  @action
  setPermanentlyLostBoughtBack(value: number) {
    this.#permanentlyLostBoughtBack = Math.max(0, value)
  }

  @action
  updatePermanentlyLostBoughtBack(fn: (value: number) => number) {
    if (this.#permanentlyLostBoughtBack !== undefined) {
      this.setPermanentlyLostBoughtBack(fn(this.#permanentlyLostBoughtBack))
    }
  }

  @computed
  get purchaseMaximum(): number | undefined {
    if (this.dbEntry.type?.kind === "Energy" && this.dbEntry.type.Energy.purchase) {
      return this.#calculateBaseValue(this.dbEntry.type.Energy.purchase.maximum)
    }
    return undefined
  }

  @computed
  get isPurchasedIncreasable() {
    // TODO
    if (this.purchased === undefined || this.purchaseMaximum === undefined) {
      return undefined
    }
    return this.purchaseMaximum > this.purchased
  }

  @computed
  get isPurchasedDecreasable() {
    // TODO
    if (this.purchased === undefined) {
      return undefined
    }
    return this.purchased > 0
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return cachedAdventurePoints(
      this.#purchased ?? 0,
      this.constructor.minValue,
      [],
      this.constructor.improvementCost,
    )
  }

  toJSON(): DisplayedDerivedCharacteristicBase {
    return {
      id: this.id,
      base: this.base,
      value: this.value,
      modifier: this.modifier,
      purchaseMaximum: this.purchaseMaximum,
      purchased: this.purchased,
      isPurchasedIncreasable: this.isPurchasedIncreasable,
      isPurchasedDecreasable: this.isPurchasedDecreasable,
      permanentlyLost: this.permanentlyLost,
      permanentlyLostBoughtBack: this.permanentlyLostBoughtBack,
    }
  }

  @action
  increment() {
    this.updatePurchased(oldValue => oldValue + 1)
  }

  @action
  decrement() {
    this.updatePurchased(oldValue => oldValue - 1)
  }
}

export class CharacterDerivedCharacteristics {
  readonly #db: Database
  readonly #character: Character
  @observable accessor #derivedCharacteristics: Record<string, CharacterDerivedCharacteristic> = {}

  constructor(db: Database, character: Character) {
    this.#db = db
    this.#character = character
  }

  getById(id: DerivedCharacteristic_ID): CharacterDerivedCharacteristic | undefined {
    return get(this.#derivedCharacteristics, id)
  }

  @computed
  get derivedCharacteristics() {
    return this.#db
      .getAllInstanceContainersOfEntity("DerivedCharacteristic")
      .map((container): DisplayedDerivedCharacteristic => ({
        ...(
          this.#derivedCharacteristics[container.id] ??
          CharacterDerivedCharacteristic.createEmpty(
            container.id,
            container.content,
            this.#character,
          )
        ).toJSON(),
        ...container.content,
      }))
      .toSorted(on(e => e.position, compareNumber))
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#derivedCharacteristics).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
      emptyAdventurePointsCache,
    )
  }

  #ensureEntryExists(id: Attribute_ID): CharacterDerivedCharacteristic {
    if (!this.#derivedCharacteristics[id]) {
      const dbEntry = this.#db.getInstanceOfEntityById("DerivedCharacteristic", id)
      this.#derivedCharacteristics[id] = CharacterDerivedCharacteristic.createEmpty(
        id,
        dbEntry,
        this.#character,
      )
    }
    return this.#derivedCharacteristics[id]
  }

  @action
  increment(id: Attribute_ID) {
    this.#ensureEntryExists(id).increment()
  }

  @action
  decrement(id: Attribute_ID) {
    this.#ensureEntryExists(id).decrement()
  }
}
