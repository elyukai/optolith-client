import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { compareNumber } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { DerivedCharacteristic as RawDerivedCharacteristic } from "@optolith/character-schema/types"
import type {
  Attribute_ID,
  DerivedCharacteristic,
  DerivedCharacteristic_ID,
  DerivedCharacteristicBase,
  DerivedCharacteristicModifierOperation,
  DerivedCharacteristicModifierPrerequisiteGroup,
  DerivedCharacteristicPurchaseMaximumValue,
} from "@optolith/database-schema/gen"
import { renderBaseCalculation } from "@optolith/entity-descriptions/entities/derivedCharacteristic"
import { evaluateMathOperation } from "@optolith/entity-descriptions/entities/partial/mathOperation"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable } from "mobx"
import { fromUniformCase } from "tsondb/schema/gen"
import type { Global } from "../global.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "./adventurePoints/cache.ts"
import { cachedAdventurePoints } from "./adventurePoints/ratedEntry.ts"
import type { BaseCharacter, Character } from "./character.ts"
import { Case } from "./databaseEnum.ts"
import { checkPrerequisitesOfDerivedCharacteristic } from "./prerequisites/fullPrerequisiteValidationForType.ts"

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
  calculationText: string | undefined
}

export type DisplayedDerivedCharacteristic = DisplayedDerivedCharacteristicBase &
  DerivedCharacteristic

const isModifierActive = (
  source: DerivedCharacteristicModifierPrerequisiteGroup,
  character: BaseCharacter,
): { active: boolean; level?: number } => {
  switch (source.kind) {
    case "Rule":
      switch (source.Rule.id.kind) {
        case "FocusRule":
          return {
            active:
              character.rules.isFocusRuleActive(source.Rule.id.FocusRule) === source.Rule.active,
          }
        case "OptionalRule":
          return {
            active:
              character.rules.isOptionalRuleActive(source.Rule.id.OptionalRule) ===
              source.Rule.active,
          }
        default:
          return assertExhaustive(source.Rule.id)
      }
    case "Activatable": {
      const entry = character
        .getActivatableCollection(source.Activatable.id.kind)
        .getByIdSafe(fromUniformCase(source.Activatable.id))

      const instanceIndexWithConfiguration = entry.getInstanceIndexWithConfiguration(
        source.Activatable,
      )

      return {
        active: instanceIndexWithConfiguration > -1 === source.Activatable.active,
        level:
          source.Activatable.level === undefined
            ? entry.instances[instanceIndexWithConfiguration]?.level
            : undefined,
      }
    }
    default:
      return assertExhaustive(source)
  }
}

const applyModifier = (
  base: number,
  operation: DerivedCharacteristicModifierOperation,
  value: number,
): number => {
  switch (operation.kind) {
    case "Addition":
      return base + value
    case "Subtraction":
      return base - value
    case "Multiplication":
      return base * value
    case "Division":
      return base / value
    default:
      return assertExhaustive(operation)
  }
}

export class CharacterDerivedCharacteristic {
  declare ["constructor"]: typeof CharacterDerivedCharacteristic

  static readonly improvementCost: ImprovementCost = "D"

  readonly global: Global
  readonly #character: BaseCharacter

  readonly id: string
  readonly dbEntry: DerivedCharacteristic
  @observable accessor #purchased: number | undefined
  @observable accessor #permanentlyLost: number | undefined
  @observable accessor #permanentlyLostBoughtBack: number | undefined

  constructor(
    global: Global,
    character: BaseCharacter,
    id: string,
    dbEntry: DerivedCharacteristic,
  ) {
    this.global = global
    this.#character = character
    this.id = id
    this.dbEntry = dbEntry

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

  @action
  static createEmpty(
    global: Global,
    character: BaseCharacter,
    id: string,
    dbEntry: DerivedCharacteristic | undefined,
  ): CharacterDerivedCharacteristic {
    if (!dbEntry) {
      throw new Error(`DerivedCharacteristic with id ${id} not provided.`)
    }
    return new CharacterDerivedCharacteristic(global, character, id, dbEntry)
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
                return this.#character.attributes.primaryBlessedAttribute?.value ?? 0
              case "Magical":
                return this.#character.attributes.highestPrimaryMagicalAttributeForArcaneEnergy ?? 0
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

  // @computed
  get base() {
    return this.#calculateBaseValue(this.dbEntry.calculation.base)
  }

  @computed
  get modifier() {
    return (
      (this.dbEntry.calculation.modifiers?.reduce((acc, modifier) => {
        const { active, level = 1 } = isModifierActive(modifier.source, this.#character)
        if (active) {
          return applyModifier(acc, modifier.operation, modifier.value * level)
        }
        return acc
      }, this.base) ?? this.base) - this.base
    )
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
      return this.#calculateBaseValue(Case("Value", this.dbEntry.type.Energy.purchase.maximum))
    }
    return undefined
  }

  @computed
  get isPurchasedIncreasable() {
    // TODO
    if (
      this.#character.isInCharacterCreation ||
      this.purchased === undefined ||
      this.purchaseMaximum === undefined
    ) {
      return undefined
    }
    return this.purchaseMaximum > this.purchased
  }

  @computed
  get isPurchasedDecreasable() {
    // TODO
    if (this.#character.isInCharacterCreation || this.purchased === undefined) {
      return undefined
    }
    return this.purchased > 0
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return addAdventurePointsCaches(
      cachedAdventurePoints(this.#purchased ?? 0, 0, [], this.constructor.improvementCost),
      this.dbEntry.type?.kind === "Energy" &&
        this.dbEntry.type.Energy.permanentLoss?.canBeBoughtBack !== undefined
        ? new AdventurePointsCache(
            this.dbEntry.type.Energy.permanentLoss.canBeBoughtBack.cost *
              (this.#permanentlyLostBoughtBack ?? 0),
            0,
          )
        : AdventurePointsCache.empty,
    )
  }

  @computed
  get calculationText(): string | undefined {
    if (
      this.dbEntry.calculation.base.kind === "Value" &&
      this.dbEntry.calculation.base.Value.kind === "Constant"
    ) {
      return undefined
    }

    const translation = this.global.locale.translateMap(this.dbEntry.translations)

    if (!translation) {
      return ""
    }

    return renderBaseCalculation(
      this.global.db.getInstanceOfEntityById.bind(this.global.db),
      this.global.locale.translate,
      this.global.locale.translateMap,
      translation,
      this.dbEntry.calculation.base,
      "compact",
    )
  }

  toJSON(): RawDerivedCharacteristic {
    if (this.#purchased !== undefined && this.#permanentlyLost !== undefined) {
      if (this.#permanentlyLostBoughtBack !== undefined) {
        return {
          type: "EnergyWithBuyBack",
          base: this.base,
          modifier: this.modifier,
          purchased: this.#purchased,
          permanentlyLost: this.#permanentlyLost,
          permanentlyLostBoughtBack: this.#permanentlyLostBoughtBack,
          maximum: this.value,
        }
      }

      return {
        type: "Energy",
        base: this.base,
        modifier: this.modifier,
        purchased: this.#purchased,
        permanentlyLost: this.#permanentlyLost,
        maximum: this.value,
      }
    }

    return {
      type: "Default",
      base: this.base,
      modifier: this.modifier,
      value: this.value,
    }
  }

  forDisplay(): DisplayedDerivedCharacteristicBase {
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
      calculationText: this.calculationText,
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

  @action
  addPermanentlyLost(value: number) {
    this.updatePermanentlyLost(oldValue => oldValue + value)
  }

  @action
  decrementBoughtBack() {
    this.updatePermanentlyLostBoughtBack(oldValue => oldValue - 1)
  }

  @action
  decrementPermanentlyLost() {
    this.updatePermanentlyLost(oldValue => oldValue - 1)
  }

  @action
  incrementBoughtBack() {
    this.updatePermanentlyLostBoughtBack(oldValue => oldValue + 1)
  }

  @action
  incrementPermanentlyLost() {
    this.updatePermanentlyLost(oldValue => oldValue + 1)
  }

  @computed
  get minimumAttributeRequiredForPurchased(): { id: Attribute_ID; value: number } | undefined {
    if (this.dbEntry.type?.kind === "Energy" && this.dbEntry.type.Energy.purchase) {
      const id = getAttributeIdForPurchased(
        this.#character,
        this.dbEntry.type.Energy.purchase.maximum,
      )
      if (!id) {
        return undefined
      }
      return {
        id,
        value: this.#character.attributes.getValueById(id),
      }
    }
    return undefined
  }
}

const getAttributeIdForPurchased = (
  character: BaseCharacter,
  maximum: DerivedCharacteristicPurchaseMaximumValue,
): Attribute_ID | undefined => {
  switch (maximum.kind) {
    case "Attribute":
      return maximum.Attribute
    case "PrimaryAttribute":
      switch (maximum.PrimaryAttribute.kind) {
        case "Blessed":
          return character.attributes.primaryBlessedAttribute?.id
        case "Magical":
          return character.attributes.singleHighestMagicalPrimaryAttributeId
        default:
          return assertExhaustive(maximum.PrimaryAttribute)
      }
    default:
      return assertExhaustive(maximum)
  }
}

export class CharacterDerivedCharacteristics {
  readonly global: Global
  readonly #character: BaseCharacter
  @observable accessor #derivedCharacteristics: Map<string, CharacterDerivedCharacteristic> =
    new Map()

  constructor(global: Global, character: BaseCharacter) {
    this.global = global
    this.#character = character
  }

  getById(id: DerivedCharacteristic_ID): CharacterDerivedCharacteristic | undefined {
    return this.#derivedCharacteristics.get(id)
  }

  @computed
  get derivedCharacteristics() {
    return this.global.db
      .getAllInstanceContainersOfEntity("DerivedCharacteristic")
      .filter(
        ({ content }) =>
          isEntryFromIncludedPublication(
            content,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.#character.rules.publicationOptions,
          ) &&
          (content.prerequisites === undefined ||
            checkPrerequisitesOfDerivedCharacteristic(
              content.prerequisites,
              this.#character.prerequisiteCapabilities,
            )),
      )
      .map((container): DisplayedDerivedCharacteristic => ({
        ...(
          this.#derivedCharacteristics.get(container.id) ??
          CharacterDerivedCharacteristic.createEmpty(
            this.global,
            this.#character,
            container.id,
            container.content,
          )
        ).forDisplay(),
        ...container.content,
      }))
      .toSorted(on(e => e.position, compareNumber))
  }

  @computed
  get adventurePointsTotal() {
    return this.#derivedCharacteristics
      .values()
      .reduce(
        (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
        emptyAdventurePointsCache,
      )
  }

  #ensureEntryExists(id: Attribute_ID): CharacterDerivedCharacteristic {
    return this.#derivedCharacteristics.getOrInsertComputed(id, () =>
      CharacterDerivedCharacteristic.createEmpty(
        this.global,
        this.#character,
        id,
        this.global.db.getInstanceOfEntityById("DerivedCharacteristic", id),
      ),
    )
  }

  increment(id: Attribute_ID) {
    this.#ensureEntryExists(id).increment()
  }

  decrement(id: Attribute_ID) {
    this.#ensureEntryExists(id).decrement()
  }

  addPermanentlyLost(id: string, value: number) {
    this.#ensureEntryExists(id).addPermanentlyLost(value)
  }

  decrementBoughtBack(id: string) {
    this.#ensureEntryExists(id).decrementBoughtBack()
  }

  decrementPermanentlyLost(id: string) {
    this.#ensureEntryExists(id).decrementPermanentlyLost()
  }

  incrementBoughtBack(id: string) {
    this.#ensureEntryExists(id).incrementBoughtBack()
  }

  incrementPermanentlyLost(id: string) {
    this.#ensureEntryExists(id).incrementPermanentlyLost()
  }

  getMinimumValuesOfAttributeForPurchased(id: Attribute_ID): number[] {
    return this.#derivedCharacteristics
      .values()
      .map(entry => entry.minimumAttributeRequiredForPurchased)
      .filter(isNotNullish)
      .filter(entry => entry.id === id)
      .map(entry => entry.value)
      .toArray()
  }

  static fromJSON(
    global: Global,
    character: Character,
    raw: Record<string, RawDerivedCharacteristic> | undefined,
  ): CharacterDerivedCharacteristics {
    const derivedCharacteristics = new CharacterDerivedCharacteristics(global, character)

    for (const [id, rawEntry] of Object.entries(raw ?? {})) {
      const entry = derivedCharacteristics.#ensureEntryExists(id)

      if (rawEntry.type === "Energy") {
        entry.setPurchased(rawEntry.purchased)
        entry.setPermanentlyLost(rawEntry.permanentlyLost)
      }

      if (rawEntry.type === "EnergyWithBuyBack") {
        entry.setPurchased(rawEntry.purchased)
        entry.setPermanentlyLost(rawEntry.permanentlyLost)
        entry.setPermanentlyLostBoughtBack(rawEntry.permanentlyLostBoughtBack)
      }
    }

    return derivedCharacteristics
  }

  toJSON(): Record<string, RawDerivedCharacteristic> {
    return Object.fromEntries(
      this.global.db
        .getAllInstanceContainersOfEntity("DerivedCharacteristic")
        .filter(
          ({ content }) =>
            isEntryFromIncludedPublication(
              content,
              this.global.db.getInstanceOfEntityById.bind(this.global.db),
              this.global.locale.translateMap,
              this.#character.rules.publicationOptions,
            ) &&
            (content.prerequisites === undefined ||
              checkPrerequisitesOfDerivedCharacteristic(
                content.prerequisites,
                this.#character.prerequisiteCapabilities,
              )),
        )
        .map((container): [string, RawDerivedCharacteristic] => [
          container.id,
          {
            ...(
              this.#derivedCharacteristics.get(container.id) ??
              CharacterDerivedCharacteristic.createEmpty(
                this.global,
                this.#character,
                container.id,
                container.content,
              )
            ).toJSON(),
          },
        ]),
    )
  }
}
