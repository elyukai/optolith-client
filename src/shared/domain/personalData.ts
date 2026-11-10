import { unique } from "@elyukai/utils/array/filters"
import { on } from "@elyukai/utils/function"
import { mapNullable } from "@elyukai/utils/nullable"
import { even } from "@elyukai/utils/number"
import { compareNumber } from "@elyukai/utils/ordering"
import { minus, parseInt, plusMinus, signStr } from "@elyukai/utils/string/number"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { PersonalData as RawPersonalData } from "@optolith/character-schema/types"
import type {
  DieType,
  EyeColor_ID,
  HairColor_ID,
  RandomHeightGeneration,
  RandomWeightGeneration,
  SocialStatus_ID,
  WeightDiceOffsetStrategy,
} from "@optolith/database-schema/gen"
import { isPublicationIncludedById } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable, toJS } from "mobx"
import type { Global } from "../global.ts"
import { randomFromArray } from "../utils/array.ts"
import { rollDice, separateDice } from "../utils/dice.ts"
import { ensureNonEmptyString } from "../utils/string.ts"
import type { BaseCharacter } from "./character.ts"
import type { Color } from "./color.ts"
import type { Sex, SexDependency } from "./sex.ts"
import type { SocialStatusDependency } from "./socialStatus.ts"

export class CharacterPersonalData {
  readonly global: Global
  character: BaseCharacter

  /**
   * The character's sex. It does not have to be binary, although it always must be specified how to handle it in the context of binary sex prerequisites. You can also provide a custom sex with a custom name.
   */
  @observable accessor sex: Sex = { type: "Female" }

  @computed
  get sexName(): string {
    const { translate } = this.global.locale
    switch (this.sex.type) {
      case "Male":
        return translate("Male")
      case "Female":
        return translate("Female")
      case "BalThani":
        return translate("Bal’Thani")
      case "Tsajana":
        return translate("Tsajana")
      case "Custom":
        return this.sex.name
      default:
        return assertExhaustive(this.sex)
    }
  }

  @computed
  get showSexualCharacteristics(): boolean {
    return isPublicationIncludedById(
      this.global.locale.translateMap,
      this.global.db.getInstanceOfEntityById.bind(this.global.db),
      this.character.rules.publicationOptions,
      this.global.settings.sexualCharacteristicsPublication,
    )
  }

  /**
   * Dependencies on the character’s sex.
   */
  @observable accessor sexDependencies: SexDependency[] = []

  /**
   * The family names and/or family members.
   */
  @observable accessor family: string | undefined

  /**
   * The place where the character was born.
   */
  @observable accessor placeOfBirth: string | undefined

  /**
   * The date when the character was born.
   */
  @observable accessor dateOfBirth: string | undefined

  /**
   * The age of the character.
   */
  @observable accessor age: string | undefined

  /**
   * The hair color of the character.
   */
  @observable accessor hairColor: Color | undefined

  @computed
  get predefinedHairColor(): HairColor_ID | undefined {
    return this.hairColor?.type === "Predefined" ? this.hairColor.id : undefined
  }

  /**
   * The eye color of the character.
   */
  @observable accessor eyeColor: Color | undefined

  @computed
  get predefinedEyeColor(): EyeColor_ID | undefined {
    return this.eyeColor?.type === "Predefined" ? this.eyeColor.id : undefined
  }

  /**
   * The size of the character.
   */
  @observable accessor size: string | undefined

  /**
   * The weight of the character.
   */
  @observable accessor weight: string | undefined

  /**
   * The character's title(s).
   */
  @observable accessor title: string | undefined

  /**
   * The social status identifier.
   */
  @observable accessor socialStatus: SocialStatus_ID | undefined

  /**
   * The social status dependencies.
   */
  @observable accessor socialStatusDependencies: SocialStatusDependency[] = []

  /**
   * The character's characteristics.
   */
  @observable accessor characteristics: string | undefined

  /**
   * Other information about the character.
   */
  @observable accessor otherInfo: string | undefined

  constructor(global: Global, character: BaseCharacter, raw?: RawPersonalData) {
    this.global = global
    this.character = character
    if (raw !== undefined) {
      this.sex = raw.sex
      this.family = raw.family
      this.placeOfBirth = raw.placeOfBirth
      this.dateOfBirth = raw.dateOfBirth
      this.age = raw.age
      this.hairColor = raw.hairColor
      this.eyeColor = raw.eyeColor
      this.size = raw.size
      this.weight = raw.weight
      this.title = raw.title
      this.socialStatus = raw.socialStatus
      this.characteristics = raw.characteristics
      this.otherInfo = raw.otherInfo
    }
  }

  @computed
  get availableHairColors(): { id: string; name: string }[] {
    return unique(this.availableHairColorsIdDice)
      .map(id => ({
        id,
        name: this.global.locale.translateMap(
          this.global.db.getInstanceOfEntityById("HairColor", id)?.translations,
        )?.name,
      }))
      .filter(
        (entry): entry is typeof entry & { name: NonNullable<(typeof entry)["name"]> } =>
          entry.name !== undefined,
      )
      .toSorted(on(x => x.name, this.global.locale.compare))
  }

  @computed
  get availableEyeColors(): { id: string; name: string }[] {
    return unique(this.availableEyeColorsIdDice)
      .map(id => ({
        id,
        name: this.global.locale.translateMap(
          this.global.db.getInstanceOfEntityById("EyeColor", id)?.translations,
        )?.name,
      }))
      .filter(
        (entry): entry is typeof entry & { name: NonNullable<(typeof entry)["name"]> } =>
          entry.name !== undefined,
      )
      .toSorted(on(x => x.name, this.global.locale.compare))
  }

  @computed
  get randomHeightCalculation(): RandomHeightGeneration | undefined {
    return this.character.race?.variant?.height
  }

  @computed
  get randomHeightCalculationString(): string | undefined {
    const { randomHeightCalculation } = this
    const { translate } = this.global.locale

    if (randomHeightCalculation === undefined) {
      return undefined
    }

    const dice = translate("D")
    const randomPart = randomHeightCalculation.random
      .map(({ number, sides }) => ` ${signStr(sides)} ${number}${dice}${sides}`)
      .join("")

    return randomHeightCalculation.base.toFixed() + randomPart
  }

  @computed
  get randomWeightCalculation(): RandomWeightGeneration | undefined {
    return this.character.race?.base?.weight
  }

  @computed
  get randomWeightCalculationString(): string | undefined {
    const { randomWeightCalculation } = this
    const { translate } = this.global.locale

    if (randomWeightCalculation === undefined) {
      return undefined
    }

    const dice = translate("D")
    const size = translate("Size")

    const signStrWeight = (offsetStrategy: WeightDiceOffsetStrategy) => {
      switch (offsetStrategy.kind) {
        case "Add":
          return "+"
        case "Subtract":
          return minus
        case "AddEvenSubtractOdd":
          return plusMinus
        default:
          return assertExhaustive(offsetStrategy)
      }
    }

    const randomPart = randomWeightCalculation.random
      .map(
        ({ number, sides, offset_strategy }) =>
          ` ${signStrWeight(offset_strategy)} ${number}${dice}${sides}`,
      )
      .join("")

    return `${size} ${minus} ${randomWeightCalculation.base}${randomPart}`
  }

  /**
   * Returns the social statuses that are available for the character based on
   * the culture.
   */
  @computed
  get availableSocialStatuses(): { id: string; name: string }[] {
    const sortedSocialStatuses = this.global.db
      .getAllInstanceContainersOfEntity("SocialStatus")
      .toSorted(on(x => x.content.position, compareNumber))

    const minimumSocialStatusPosition =
      this.socialStatusDependencies.length === 0
        ? 0
        : Math.max(
            0,
            ...this.socialStatusDependencies.map(dep =>
              sortedSocialStatuses.findIndex(status => status.id === dep.id),
            ),
          )

    return sortedSocialStatuses.slice(minimumSocialStatusPosition).map(status => ({
      id: status.id,
      name: this.global.locale.translateMap(status.content.translations)?.name ?? status.id,
    }))
  }

  @computed
  get availableHairColorsIdDice(): HairColor_ID[] {
    return this.character.race?.variant?.hair_color ?? []
  }

  @computed
  get availableEyeColorsIdDice(): EyeColor_ID[] {
    // TODO: Handle albino and green haired

    // const isAlbino = isOptionActive(stigma, { tag: "General", general: ALBINO })
    // const isGreenHaired = isOptionActive(stigma, { tag: "General", general: GREEN_HAIR })

    // if (isAlbino || isGreenHaired) {
    //   return filterNonNullable([
    //     isAlbino ? HairColorIdentifier.White : undefined,
    //     isGreenHaired ? HairColorIdentifier.Green : undefined,
    //   ])

    return this.character.race?.variant?.eye_color ?? []
  }

  @action
  rerollEyeColor() {
    this.eyeColor = mapNullable(randomFromArray(this.availableHairColorsIdDice), id => ({
      type: "Predefined",
      id,
    }))
  }

  @action
  rerollHairColor() {
    this.eyeColor = mapNullable(randomFromArray(this.availableHairColorsIdDice), id => ({
      type: "Predefined",
      id,
    }))
  }

  @action
  rerollSize() {
    if (this.randomHeightCalculation !== undefined) {
      this.size = rerollHeightLogic(this.randomHeightCalculation).toFixed()
    }
  }

  @action
  rerollWeight() {
    if (this.randomWeightCalculation !== undefined && this.randomHeightCalculation !== undefined) {
      const { height, isNew } = (() => {
        const heightStr = this.size
        const previousHeight = heightStr === undefined ? undefined : parseInt(heightStr)

        if (previousHeight === undefined) {
          return { height: rerollHeightLogic(this.randomHeightCalculation), isNew: true }
        }

        return { height: previousHeight, isNew: false }
      })()

      if (isNew) {
        this.size = height.toFixed()
      }

      this.weight = (height + rerollWeightLogic(this.randomWeightCalculation)).toString()
    }
  }

  @action
  setAge(newAge: string) {
    this.age = ensureNonEmptyString(newAge)
  }

  @action
  setCharacteristics(newCharacteristics: string) {
    this.characteristics = ensureNonEmptyString(newCharacteristics)
  }

  @action
  setDateOfBirth(newDateOfBirth: string) {
    this.dateOfBirth = ensureNonEmptyString(newDateOfBirth)
  }

  @action
  setFamily(newFamily: string) {
    this.family = ensureNonEmptyString(newFamily)
  }

  @action
  setOtherInfo(newOtherInfo: string) {
    this.otherInfo = ensureNonEmptyString(newOtherInfo)
  }

  @action
  setPlaceOfBirth(newPlaceOfBirth: string) {
    this.placeOfBirth = ensureNonEmptyString(newPlaceOfBirth)
  }

  @action
  setPredefinedEyeColor(newPredefinedEyeColor: EyeColor_ID) {
    this.eyeColor = { type: "Predefined", id: newPredefinedEyeColor }
  }

  @action
  setPredefinedHairColor(newPredefinedHairColor: HairColor_ID) {
    this.hairColor = { type: "Predefined", id: newPredefinedHairColor }
  }

  @action
  setSize(newSize: string) {
    this.size = ensureNonEmptyString(newSize)
  }

  @action
  setSocialStatus(newSocialStatus: SocialStatus_ID) {
    this.socialStatus = newSocialStatus
  }

  @action
  setTitle(newTitle: string) {
    this.title = ensureNonEmptyString(newTitle)
  }

  @action
  setWeight(newWeight: string) {
    this.weight = ensureNonEmptyString(newWeight)
  }

  toJSON(): RawPersonalData {
    return {
      sex: toJS(this.sex),
      family: this.family,
      placeOfBirth: this.placeOfBirth,
      dateOfBirth: this.dateOfBirth,
      age: this.age,
      hairColor: toJS(this.hairColor),
      eyeColor: toJS(this.eyeColor),
      size: this.size,
      weight: this.weight,
      title: this.title,
      socialStatus: this.socialStatus,
      characteristics: this.characteristics,
      otherInfo: this.otherInfo,
    }
  }
}

const rerollHeightLogic = (height: RandomHeightGeneration) => {
  const separatedDice = height.random.flatMap(separateDice)
  const diceRollSum = separatedDice.reduce((acc, sides) => acc + rollDice(sides), 0)
  return height.base + diceRollSum
}

const rerollWeightLogic = (weight: RandomWeightGeneration) => {
  const separatedDice = weight.random.flatMap(dice =>
    Array.from({ length: dice.number }, () => [dice.sides, dice.offset_strategy] as const),
  )

  const rollWeightDice = (sides: DieType, strategy: WeightDiceOffsetStrategy) => {
    switch (strategy.kind) {
      case "Add":
        return rollDice(sides)
      case "Subtract":
        return -rollDice(sides)
      case "AddEvenSubtractOdd": {
        const result = rollDice(sides)
        return result * (even(result) ? 1 : -1)
      }
      default:
        return assertExhaustive(strategy)
    }
  }

  const diceRollSum = separatedDice.reduce(
    (acc, [sides, strategy]) => acc + rollWeightDice(sides, strategy),
    0,
  )
  return -weight.base + diceRollSum
}
