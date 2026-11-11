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
  DerivedCharacteristicType,
} from "@optolith/database-schema/gen"
import { renderBaseCalculation } from "@optolith/entity-descriptions/entities/derivedCharacteristic"
import { evaluateMathOperation } from "@optolith/entity-descriptions/entities/partial/mathOperation"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable } from "mobx"
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
  position: number
  type?: DerivedCharacteristicType
  name: string
  abbreviation: string
  unitAbbreviation?: string
  description?: string
}

export type DisplayedDerivedCharacteristic = DisplayedDerivedCharacteristicBase

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
            level: character.rules.optionalRules.getOptionValue(source.Rule.id.OptionalRule),
          }
        default:
          return assertExhaustive(source.Rule.id)
      }
    case "Activatable": {
      const entry = character.getActivatableById(source.Activatable.id)

      const instanceIndexWithConfiguration =
        entry?.getInstanceIndexWithConfiguration(source.Activatable) ?? -1

      return {
        active: instanceIndexWithConfiguration > -1 === source.Activatable.active,
        level:
          source.Activatable.level === undefined
            ? entry?.instances[instanceIndexWithConfiguration]?.level
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
  readonly global: Global
  readonly character: BaseCharacter

  readonly id: string
  readonly dbEntry: DerivedCharacteristic

  constructor(
    global: Global,
    character: BaseCharacter,
    id: string,
    dbEntry: DerivedCharacteristic,
  ) {
    this.global = global
    this.character = character
    this.id = id
    this.dbEntry = dbEntry
  }

  protected calculateBaseValue(baseValue: DerivedCharacteristicBase) {
    return Math.round(
      evaluateMathOperation(baseValue, value => {
        switch (value.kind) {
          case "Attribute":
            return this.character.attributes.getValueById(value.Attribute)
          case "Constant":
            return value.Constant
          case "PrimaryAttribute":
            switch (value.PrimaryAttribute.kind) {
              case "Blessed":
                return this.character.attributes.primaryBlessedAttribute?.value ?? 0
              case "Magical":
                return this.character.attributes.highestPrimaryMagicalAttributeForArcaneEnergy ?? 0
              default:
                return assertExhaustive(value.PrimaryAttribute)
            }
          case "RaceBaseValue":
            return this.character.race?.base?.base_values?.[this.id]?.value ?? 0
          default:
            return assertExhaustive(value)
        }
      }),
    )
  }

  // @computed
  get base() {
    return this.calculateBaseValue(this.dbEntry.calculation.base)
  }

  @computed
  get modifier() {
    return (
      (this.dbEntry.calculation.modifiers?.reduce((acc, modifier) => {
        const { active, level = 1 } = isModifierActive(modifier.source, this.character)
        if (active) {
          return applyModifier(acc, modifier.operation, modifier.value * level)
        }
        return acc
      }, this.base) ?? this.base) - this.base
    )
  }

  @computed
  get value() {
    return this.base + this.modifier
  }

  get adventurePoints(): AdventurePointsCache {
    return AdventurePointsCache.empty
  }

  @computed
  get calculationText(): string | undefined {
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
    return {
      type: "Default",
      base: this.base,
      modifier: this.modifier,
      value: this.value,
    }
  }

  forDisplay(): DisplayedDerivedCharacteristicBase | undefined {
    const translation = this.global.locale.translateMap(this.dbEntry.translations)
    if (!translation) {
      return
    }
    return {
      id: this.id,
      base: this.base,
      value: this.value,
      modifier: this.modifier,
      calculationText: this.calculationText,
      position: this.dbEntry.position,
      type: this.dbEntry.type,
      name: translation.name,
      abbreviation: translation.abbreviation,
      unitAbbreviation: translation.unitAbbreviation,
      description: translation.description,
    }
  }
}

export type Energy = DerivedCharacteristic & { type: { kind: "Energy" } }

const isEnergy = (entry: DerivedCharacteristic): entry is Energy => entry.type?.kind === "Energy"

export class CharacterEnergy extends CharacterDerivedCharacteristic {
  declare ["constructor"]: typeof CharacterEnergy

  static readonly improvementCost: ImprovementCost = "D"

  override readonly dbEntry: Energy
  @observable accessor #purchased: number | undefined
  @observable accessor #permanentlyLost: number | undefined
  @observable accessor #permanentlyLostBoughtBack: number | undefined

  constructor(global: Global, character: BaseCharacter, id: string, dbEntry: Energy) {
    super(global, character, id, dbEntry)
    this.dbEntry = dbEntry

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

  @computed
  override get value() {
    return (
      super.value +
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
      return this.calculateBaseValue(Case("Value", this.dbEntry.type.Energy.purchase.maximum))
    }
    return undefined
  }

  @computed
  get isPurchasedIncreasable() {
    if (
      this.character.isInCharacterCreation ||
      this.purchased === undefined ||
      this.purchaseMaximum === undefined ||
      (this.permanentlyLost !== undefined &&
        this.permanentlyLostBoughtBack !== undefined &&
        this.permanentlyLost < this.permanentlyLostBoughtBack)
    ) {
      return undefined
    }
    return this.purchaseMaximum > this.purchased
  }

  @computed
  get isPurchasedDecreasable() {
    if (!this.character.canRemove || this.purchased === undefined) {
      return undefined
    }
    return this.purchased > 0
  }

  @computed
  override get adventurePoints(): AdventurePointsCache {
    return addAdventurePointsCaches(
      cachedAdventurePoints(this.#purchased ?? 0, 0, [], this.constructor.improvementCost),
      this.dbEntry.type.Energy.permanentLoss?.canBeBoughtBack !== undefined
        ? new AdventurePointsCache(
            this.dbEntry.type.Energy.permanentLoss.canBeBoughtBack.cost *
              (this.#permanentlyLostBoughtBack ?? 0),
            0,
          )
        : AdventurePointsCache.empty,
    )
  }

  override toJSON(): RawDerivedCharacteristic {
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

  override forDisplay(): DisplayedDerivedCharacteristicBase | undefined {
    const translation = this.global.locale.translateMap(this.dbEntry.translations)
    if (!translation) {
      return
    }
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
      position: this.dbEntry.position,
      type: this.dbEntry.type,
      name: translation.name,
      abbreviation: translation.abbreviation,
      unitAbbreviation: translation.unitAbbreviation,
      description: translation.description,
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
        this.character,
        this.dbEntry.type.Energy.purchase.maximum,
      )
      if (!id) {
        return undefined
      }
      return {
        id,
        value: this.character.attributes.getValueById(id),
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
    for (const container of this.global.db.getAllInstanceContainersOfEntity(
      "DerivedCharacteristic",
    )) {
      this.#derivedCharacteristics.set(
        container.id,
        isEnergy(container.content)
          ? new CharacterEnergy(global, character, container.id, container.content)
          : new CharacterDerivedCharacteristic(global, character, container.id, container.content),
      )
    }
  }

  getById(id: DerivedCharacteristic_ID): CharacterDerivedCharacteristic | undefined {
    return this.#derivedCharacteristics.get(id)
  }

  getEnergyById(id: DerivedCharacteristic_ID): CharacterEnergy | undefined {
    const entry = this.getById(id)
    return entry instanceof CharacterEnergy ? entry : undefined
  }

  @computed
  get derivedCharacteristics() {
    return this.#derivedCharacteristics
      .values()
      .filter(
        dc =>
          isEntryFromIncludedPublication(
            dc.dbEntry,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.#character.rules.publicationOptions,
          ) &&
          (dc.dbEntry.prerequisites === undefined ||
            checkPrerequisitesOfDerivedCharacteristic(
              dc.dbEntry.prerequisites,
              this.#character.prerequisiteCapabilities,
            )),
      )
      .map(dc => dc.forDisplay())
      .filter(isNotNullish)
      .toArray()
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

  increment(id: Attribute_ID) {
    this.getEnergyById(id)?.increment()
  }

  decrement(id: Attribute_ID) {
    this.getEnergyById(id)?.decrement()
  }

  addPermanentlyLost(id: string, value: number) {
    this.getEnergyById(id)?.addPermanentlyLost(value)
  }

  decrementBoughtBack(id: string) {
    this.getEnergyById(id)?.decrementBoughtBack()
  }

  decrementPermanentlyLost(id: string) {
    this.getEnergyById(id)?.decrementPermanentlyLost()
  }

  incrementBoughtBack(id: string) {
    this.getEnergyById(id)?.incrementBoughtBack()
  }

  incrementPermanentlyLost(id: string) {
    this.getEnergyById(id)?.incrementPermanentlyLost()
  }

  getMinimumValuesOfAttributeForPurchased(id: Attribute_ID): number[] {
    return this.#derivedCharacteristics
      .values()
      .map(entry =>
        entry instanceof CharacterEnergy ? entry.minimumAttributeRequiredForPurchased : undefined,
      )
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
      const entry = derivedCharacteristics.getById(id)

      if (entry instanceof CharacterEnergy) {
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
    }

    return derivedCharacteristics
  }

  toJSON(): Record<string, RawDerivedCharacteristic> {
    return Object.fromEntries(
      this.#derivedCharacteristics
        .values()
        .filter(
          dc =>
            isEntryFromIncludedPublication(
              dc.dbEntry,
              this.global.db.getInstanceOfEntityById.bind(this.global.db),
              this.global.locale.translateMap,
              this.#character.rules.publicationOptions,
            ) &&
            (dc.dbEntry.prerequisites === undefined ||
              checkPrerequisitesOfDerivedCharacteristic(
                dc.dbEntry.prerequisites,
                this.#character.prerequisiteCapabilities,
              )),
        )
        .map((dc): [string, RawDerivedCharacteristic] => [dc.id, dc.toJSON()]),
    )
  }
}
