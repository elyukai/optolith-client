import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { count, sumWith } from "@elyukai/utils/array/reductions"
import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import {
  getAdventurePointsForActivation,
  getAdventurePointsForRating,
  getAdventurePointsForRatingRange,
  type ImprovementCost,
} from "@optolith/adventure-points/improvement-cost"
import type { ResolvedSkillApplicationIdentifier } from "@optolith/database-schema/cache"
import type {
  Attribute_ID,
  Cantrip_ID,
  CombatTechniqueIdentifier,
  Language_ID,
  Script_ID,
  Skill_ID,
} from "@optolith/database-schema/gen"
import { action, computed, observable, toJS } from "mobx"
import type {
  ActivatableOption,
  SerializedActivatableInstance,
} from "../../../../../../shared/domain/activatable/activatable.ts"
import { Case, equalsCase } from "../../../../../../shared/domain/databaseEnum.ts"
import type {
  DisplayedActivatableEntrySelectOption,
  DisplayedCombatTechniquesSelectOption,
} from "../../../../../../shared/domain/profession.ts"
import type { CharacterIPCSelectors } from "../../../../../../shared/ipc.ts"

export class SelectedAttributeAdjustment {
  readonly character: CharacterIPCSelectors

  @observable accessor attributeAdjustmentId: Attribute_ID | undefined

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.race.attributeAdjustment === undefined ||
      this.attributeAdjustmentId !== undefined
    )
  }

  @action
  setAttributeAdjustmentId(id: Attribute_ID | undefined) {
    this.attributeAdjustmentId = id
  }
}

export class SelectedNativeTongueAndScript {
  readonly character: CharacterIPCSelectors

  @observable accessor nativeTongue: Language_ID | undefined
  @observable accessor buyScript = false
  @observable accessor script: Script_ID | undefined

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      (raceCultureProfessionSelectOptions.culture.nativeTongue === undefined ||
        raceCultureProfessionSelectOptions.culture.nativeTongue.length === 1 ||
        this.nativeTongue !== undefined) &&
      (raceCultureProfessionSelectOptions.culture.scripts === undefined ||
        raceCultureProfessionSelectOptions.culture.scripts.length === 1 ||
        !this.buyScript ||
        this.script !== undefined)
    )
  }

  @action
  setNativeTongue(id: Language_ID | undefined) {
    this.nativeTongue = id
  }

  @computed
  get safeNativeTongue(): Language_ID | undefined {
    const { raceCultureProfessionSelectOptions } = this.character

    if (
      raceCultureProfessionSelectOptions === undefined ||
      raceCultureProfessionSelectOptions.culture.nativeTongue === undefined
    ) {
      return undefined
    }

    if (raceCultureProfessionSelectOptions.culture.nativeTongue.length === 1) {
      return raceCultureProfessionSelectOptions.culture.nativeTongue[0].id
    }

    return this.nativeTongue
  }

  @computed
  get safeNativeScript(): Script_ID | undefined {
    const { raceCultureProfessionSelectOptions } = this.character

    if (
      raceCultureProfessionSelectOptions === undefined ||
      raceCultureProfessionSelectOptions.culture.scripts === undefined ||
      !this.buyScript
    ) {
      return undefined
    }

    if (raceCultureProfessionSelectOptions.culture.scripts.length === 1) {
      return raceCultureProfessionSelectOptions.culture.scripts[0].id
    }

    return this.script
  }

  @action
  toggleBuyScript() {
    this.buyScript = !this.buyScript
  }

  @action
  setScript(id: Script_ID | undefined) {
    this.script = id
  }
}

export class SelectedSkillSpecialization {
  readonly character: CharacterIPCSelectors

  @observable accessor skillSpecialization: Skill_ID | undefined
  @observable accessor skillSpecializationApplication:
    | ResolvedSkillApplicationIdentifier
    | undefined

  constructor(character: CharacterIPCSelectors) {
    this.character = character
    const skillSpecialization =
      this.character.raceCultureProfessionSelectOptions?.profession.skillSpecialization
    this.skillSpecialization =
      skillSpecialization && isNotEmpty(skillSpecialization) && skillSpecialization.length === 1
        ? skillSpecialization[0].id
        : undefined
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.profession.skillSpecialization === undefined ||
      ((raceCultureProfessionSelectOptions.profession.skillSpecialization.length === 1 ||
        this.skillSpecialization !== undefined) &&
        this.skillSpecializationApplication !== undefined)
    )
  }

  @action
  setSkillSpecialization(id: Skill_ID | undefined) {
    this.skillSpecialization = id
    this.skillSpecializationApplication = undefined
  }

  @computed
  get skillSpecializationApplications(): {
    id: ResolvedSkillApplicationIdentifier
    name: string
  }[] {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return []
    }

    const skillSpecialization =
      raceCultureProfessionSelectOptions.profession.skillSpecialization?.find(
        s => s.id === this.skillSpecialization,
      )

    return skillSpecialization?.applications ?? []
  }

  @action
  setSkillSpecializationApplication(id: ResolvedSkillApplicationIdentifier | undefined) {
    this.skillSpecializationApplication = id
  }
}

export class SelectedLanguagesAndLiteracy {
  readonly character: CharacterIPCSelectors

  @observable accessor languages: Map<Language_ID, number> = new Map()
  @observable accessor scripts: Set<Script_ID> = new Set()

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.profession.languagesLiteracy === undefined ||
      raceCultureProfessionSelectOptions.profession.languagesLiteracy.apValue === this.usedAP
    )
  }

  @computed
  get usedAP(): number {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return 0
    }

    const forLanguages = this.languages.values().reduce((sum, level) => sum + level * 2, 0)
    const forScripts = this.scripts.values().reduce((sum, scriptId) => {
      const script = raceCultureProfessionSelectOptions.profession.languagesLiteracy?.scripts?.find(
        s => s.id === scriptId,
      )
      return sum + (script?.apValue ?? 0)
    }, 0)

    return forLanguages + forScripts
  }

  @computed
  get apLeft(): number {
    const config = this.character.raceCultureProfessionSelectOptions?.profession.languagesLiteracy
    return config === undefined ? 0 : config.apValue - this.usedAP
  }

  @action
  toggleLanguage(id: Language_ID) {
    if (this.languages.has(id)) {
      this.languages.delete(id)
    } else {
      this.languages.set(id, 1)
    }
  }

  @action
  setLanguageLevel(id: Language_ID, level: number) {
    if (level <= 0) {
      this.languages.delete(id)
    } else {
      this.languages.set(id, level)
    }
  }

  @action
  toggleScript(id: Script_ID) {
    if (this.scripts.has(id)) {
      this.scripts.delete(id)
    } else {
      this.scripts.add(id)
    }
  }
}

export class SelectedRatedForAP {
  readonly getConfig: () =>
    | {
        apValue: number
        entries: { id: string; improvementCost: ImprovementCost }[]
      }
    | undefined
  readonly character: CharacterIPCSelectors
  readonly withActivation: boolean

  @observable accessor rated: Map<string, number> = new Map()

  constructor(
    character: CharacterIPCSelectors,
    getConfig: typeof this.getConfig,
    withActivation: boolean,
  ) {
    this.character = character
    this.getConfig = getConfig
    this.withActivation = withActivation
  }

  @computed
  get isValid(): boolean {
    const config = this.getConfig()
    return config === undefined || config.apValue === this.usedAP
  }

  @computed
  get usedAP(): number {
    const config = this.getConfig()
    return config === undefined
      ? 0
      : this.rated.entries().reduce((sum, [id, value]) => {
          const entry = config.entries.find(e => e.id === id)
          if (entry === undefined) {
            return sum
          } else {
            return (
              sum +
              (this.withActivation ? getAdventurePointsForActivation(entry.improvementCost) : 0) +
              getAdventurePointsForRatingRange(entry.improvementCost, 0, value)
            )
          }
        }, 0)
  }

  @computed
  get apLeft(): number {
    const config = this.getConfig()
    return config === undefined ? 0 : config.apValue - this.usedAP
  }

  @action
  toggle(id: string) {
    if (this.rated.has(id)) {
      this.rated.delete(id)
    } else {
      this.rated.set(id, this.withActivation ? 0 : 1)
    }
  }

  @action
  increment(id: string) {
    const currentRating = this.withActivation ? this.rated.get(id) : this.rated.getOrInsert(id, 0)
    this.rated.set(
      id,
      Math.min(
        this.character.startExperienceLevel?.max_skill_rating ?? 0,
        (currentRating ?? -1) + 1,
      ),
    )
  }

  @action
  decrement(id: string) {
    const currentRating = this.rated.get(id)
    if (currentRating === undefined) {
      return
    }
    if (currentRating <= (this.withActivation ? 0 : 1)) {
      this.rated.delete(id)
    } else {
      this.rated.set(id, currentRating - 1)
    }
  }

  getRating(id: string): number | undefined {
    return this.rated.get(id)
  }

  getDisplayRating(id: string): number | undefined {
    return this.getRating(id) ?? (this.withActivation ? undefined : 0)
  }

  getNextCost(id: string): number {
    const entry = this.getConfig()?.entries.find(e => e.id === id)
    if (entry === undefined) {
      return Infinity
    }
    const currentRating = this.getRating(id) ?? (this.withActivation ? undefined : 0)
    return currentRating === undefined
      ? getAdventurePointsForActivation(entry.improvementCost)
      : getAdventurePointsForRating(entry.improvementCost, currentRating + 1)
  }

  canIncrement(id: string): boolean {
    const config = this.getConfig()
    if (config === undefined) {
      return false
    }
    const rating = this.getRating(id)
    const satisfiesMaxRating =
      rating === undefined || rating < (this.character.startExperienceLevel?.max_skill_rating ?? 0)
    const nextCost = this.getNextCost(id)
    return satisfiesMaxRating && nextCost <= this.apLeft
  }

  canDecrement(id: string): boolean {
    const config = this.getConfig()
    if (config === undefined) {
      return false
    }
    return this.getRating(id) !== undefined
  }
}

export class SelectedMultiEntityRatedForAP<E extends string> {
  readonly getConfig: () =>
    | {
        apValue: number
        entries: { id: Case<E, string>; improvementCost: ImprovementCost }[]
        number?: number
      }
    | undefined
  readonly character: CharacterIPCSelectors

  @observable accessor rated: Map<E, Map<string, number>> = new Map()
  readonly withActivation: boolean

  constructor(
    character: CharacterIPCSelectors,
    getConfig: typeof this.getConfig,
    withActivation: boolean,
  ) {
    this.character = character
    this.getConfig = getConfig
    this.withActivation = withActivation
  }

  @computed
  get isValid(): boolean {
    const config = this.getConfig()
    return (
      config === undefined ||
      config.apValue === this.usedAP ||
      config.number === undefined ||
      config.number === this.usedNumber
    )
  }

  @computed
  get usedAP(): number {
    const config = this.getConfig()
    return config === undefined
      ? 0
      : this.rated.entries().reduce(
          (sum, [entity, entityMap]) =>
            entityMap.entries().reduce<number>((nestedSum, [id, value]) => {
              const entry = config.entries.find(e => e.id.kind === entity && e.id[entity] === id)
              if (entry === undefined) {
                return nestedSum
              } else {
                return (
                  nestedSum +
                  (this.withActivation
                    ? getAdventurePointsForActivation(entry.improvementCost)
                    : 0) +
                  getAdventurePointsForRatingRange(entry.improvementCost, 0, value)
                )
              }
            }, sum),
          0,
        )
  }

  @computed
  get apLeft(): number {
    const config = this.getConfig()
    return config === undefined ? 0 : config.apValue - this.usedAP
  }

  @computed
  get usedNumber(): number {
    return sumWith(this.rated.values(), entityMap => entityMap.size)
  }

  @action
  toggle(id: Case<E, string>) {
    const entityMap = this.rated.getOrInsert(id.kind, new Map())
    const stringId = id[id.kind]
    if (entityMap.has(stringId)) {
      entityMap.delete(stringId)
    } else {
      entityMap.set(stringId, this.withActivation ? 0 : 1)
    }
    // TODO: Check prerequisites
  }

  @action
  increment(id: Case<E, string>) {
    const entityMap = this.rated.getOrInsert(id.kind, new Map())
    const stringId = id[id.kind]
    const currentRating = this.withActivation
      ? entityMap.get(stringId)
      : entityMap.getOrInsert(stringId, 0)
    entityMap.set(
      stringId,
      Math.min(
        this.character.startExperienceLevel?.max_skill_rating ?? 0,
        (currentRating ?? -1) + 1,
      ),
    )
  }

  @action
  decrement(id: Case<E, string>) {
    const entityMap = this.rated.getOrInsert(id.kind, new Map())
    const stringId = id[id.kind]
    const currentRating = entityMap.get(stringId)
    if (currentRating === undefined) {
      return
    }
    if (currentRating <= (this.withActivation ? 0 : 1)) {
      entityMap.delete(stringId)
    } else {
      entityMap.set(stringId, currentRating - 1)
    }
  }

  getRating(id: Case<E, string>): number | undefined {
    return this.rated.get(id.kind)?.get(id[id.kind])
  }

  getDisplayRating(id: Case<E, string>): number | undefined {
    return this.getRating(id) ?? (this.withActivation ? undefined : 0)
  }

  getNextCost(id: Case<E, string>): number {
    const entry = this.getConfig()?.entries.find(e => equalsCase(e.id, id))
    if (entry === undefined) {
      return Infinity
    }
    const currentRating = this.getRating(id) ?? (this.withActivation ? undefined : 0)
    return currentRating === undefined
      ? getAdventurePointsForActivation(entry.improvementCost)
      : getAdventurePointsForRating(entry.improvementCost, currentRating + 1)
  }

  canIncrement(id: Case<E, string>): boolean {
    const config = this.getConfig()
    if (config === undefined) {
      return false
    }
    const rating = this.getRating(id)
    const satisfiesMaxRating =
      rating === undefined || rating < (this.character.startExperienceLevel?.max_skill_rating ?? 0)
    const satisfiesMaxNumber =
      config.number === undefined || this.usedNumber < config.number || rating !== undefined
    const nextCost = this.getNextCost(id)
    return satisfiesMaxRating && satisfiesMaxNumber && nextCost <= this.apLeft
  }

  canDecrement(id: Case<E, string>): boolean {
    const config = this.getConfig()
    if (config === undefined) {
      return false
    }
    return this.getRating(id) !== undefined
  }
}

export class SelectedCantrips {
  readonly character: CharacterIPCSelectors

  @observable accessor cantrips: Set<Cantrip_ID> = new Set()

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.profession.cantrips === undefined ||
      raceCultureProfessionSelectOptions.profession.cantrips.number === this.cantrips.size
    )
  }

  @action
  toggleCantrip(id: Cantrip_ID) {
    if (this.cantrips.has(id)) {
      this.cantrips.delete(id)
    } else {
      this.cantrips.add(id)
    }
  }

  switchCantrip(id: Cantrip_ID) {
    this.cantrips.clear()
    this.cantrips.add(id)
  }

  isActive(id: Cantrip_ID): boolean {
    return this.cantrips.has(id)
  }

  canToggle(id: Cantrip_ID): boolean {
    return this.cantrips.has(id) || !this.hasMaximumCantrips
  }

  @computed
  get hasMaximumCantrips(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return true
    }

    return (
      raceCultureProfessionSelectOptions.profession.cantrips !== undefined &&
      this.cantrips.size >= raceCultureProfessionSelectOptions.profession.cantrips.number
    )
  }
}

export class SelectedCombatTechniques {
  readonly character: CharacterIPCSelectors

  @observable accessor combatTechniques: CombatTechniqueIdentifier[][] = []

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.profession.combatTechniques === undefined ||
      raceCultureProfessionSelectOptions.profession.combatTechniques.fixed.every(
        (fixed, fixedIndex) => this.combatTechniques[fixedIndex]?.length === fixed.number,
      )
    )
  }

  @action
  setCombatTechnique(id: CombatTechniqueIdentifier, fixedIndex: number, optionIndex: number) {
    const combatTechniquesForIndex = (this.combatTechniques[fixedIndex] ??= observable([]))
    combatTechniquesForIndex[optionIndex] = id
  }

  isActive(id: CombatTechniqueIdentifier): boolean {
    return this.combatTechniques.some(atIndex => atIndex.some(ctId => equalsCase(ctId, id)))
  }

  @computed
  get slots(): {
    fixedIndex: number
    ratingModifier: number
    current: CombatTechniqueIdentifier | undefined
    optionIndex: number
    available: DisplayedCombatTechniquesSelectOption["combatTechniques"]
  }[] {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return []
    }

    return (
      raceCultureProfessionSelectOptions.profession.combatTechniques?.fixed.flatMap(
        (fixed, fixedIndex) =>
          Array.from({ length: fixed.number }, (_, optionIndex) => {
            const current = this.combatTechniques[fixedIndex]?.[optionIndex]
            return {
              fixedIndex,
              ratingModifier: fixed.rating_modifier,
              optionIndex,
              current,
              available:
                raceCultureProfessionSelectOptions.profession.combatTechniques?.combatTechniques.filter(
                  ct => (current && equalsCase(ct.id, current)) || !this.isActive(ct.id),
                ) ?? [],
            }
          }),
      ) ?? []
    )
  }

  @computed
  get availableCombatTechniques(): DisplayedCombatTechniquesSelectOption["combatTechniques"] {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return []
    }

    return (
      raceCultureProfessionSelectOptions.profession.combatTechniques?.combatTechniques.filter(ct =>
        this.isActive(ct.id),
      ) ?? []
    )
  }

  toSerialized() {
    return this.slots
      .map(slot => {
        if (slot.current === undefined) {
          return undefined
        }
        return { id: toJS(slot.current), ratingModifier: slot.ratingModifier }
      })
      .filter(isNotNullish)
  }
}

export class SelectedOther {
  readonly character: CharacterIPCSelectors

  constructor(character: CharacterIPCSelectors) {
    this.character = character
  }

  @observable accessor indices: Map<number, number> = new Map()
  @observable accessor options: Map<number, Map<number, Map<number, ActivatableOption>>> = new Map()

  #isActivatableValid(
    option: DisplayedActivatableEntrySelectOption,
    optionIndex: number,
    optionOptionIndex: number,
  ): boolean {
    const requiredOptions = count(option.options, opt => opt.kind !== "preset")
    return this.options.get(optionIndex)?.get(optionOptionIndex)?.size === requiredOptions
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      raceCultureProfessionSelectOptions.profession.separateSelects === undefined ||
      raceCultureProfessionSelectOptions.profession.separateSelects.every((select, selectIndex) => {
        if (Array.isArray(select)) {
          const selectedIndex = this.indices.get(selectIndex)
          return (
            selectedIndex !== undefined &&
            select[selectedIndex] &&
            (select[selectedIndex].tag === "general" ||
              this.#isActivatableValid(select[selectedIndex], selectIndex, 0))
          )
        } else {
          return this.#isActivatableValid(select, selectIndex, 0)
        }
      })
    )
  }

  getActivatableOptions(
    optionIndex: number,
    optionOptionIndex: number,
  ): (ActivatableOption | undefined)[] {
    const option =
      this.character.raceCultureProfessionSelectOptions?.profession.separateSelects?.[optionIndex]
    const optionOption = Array.isArray(option) ? option[this.indices.get(optionIndex) ?? 0] : option

    if (optionOption === undefined || optionOption.tag === "general") {
      return []
    }

    const map = this.options.get(optionIndex)?.get(optionOptionIndex)

    return map === undefined
      ? []
      : optionOption.options.map(
          (optionOptionOption, optionOptionOptionIndex): ActivatableOption | undefined =>
            map.get(optionOptionOptionIndex) ??
            (optionOptionOption.kind === "preset" ? optionOptionOption.value : undefined),
        )
  }

  setSelectedOptionIndex(optionIndex: number, optionOptionIndex: number) {
    this.indices.set(optionIndex, optionOptionIndex)
  }

  getActivatableOption(
    optionIndex: number,
    optionOptionIndex: number,
    optionOptionOptionIndex: number,
  ): ActivatableOption | undefined {
    return this.options.get(optionIndex)?.get(optionOptionIndex)?.get(optionOptionOptionIndex)
  }

  setActivatableOption(
    optionIndex: number,
    optionOptionIndex: number,
    optionOptionOptionIndex: number,
    value: ActivatableOption | undefined,
  ) {
    const optionMap = this.options.getOrInsertComputed(optionIndex, () => observable(new Map()))
    const optionOptionMap = optionMap.getOrInsertComputed(optionOptionIndex, () =>
      observable(new Map()),
    )

    if (value === undefined) {
      optionOptionMap.delete(optionOptionOptionIndex)
      if (optionOptionMap.size === 0) {
        optionMap.delete(optionOptionIndex)
        if (optionMap.size === 0) {
          this.options.delete(optionIndex)
        }
      }
    } else {
      optionOptionMap.set(optionOptionOptionIndex, value)
    }
  }

  toSerialized() {
    return (
      this.character.raceCultureProfessionSelectOptions?.profession.separateSelects
        .map((option, optionIndex) => {
          if (Array.isArray(option)) {
            const selectedIndex = this.indices.get(optionIndex)
            const selectedOption = selectedIndex !== undefined ? option[selectedIndex] : undefined
            if (selectedIndex === undefined || selectedOption === undefined) {
              return undefined
            }
            if (selectedOption.tag === "general") {
              return selectedOption.value
            }
            const instance: SerializedActivatableInstance = {
              level: selectedOption.level?.value,
              options: this.getActivatableOptions(optionIndex, selectedIndex)
                .filter(isNotNullish)
                .map(o => toJS(o)),
            }
            return Case("IncompleteActivatable", {
              id: Case(selectedOption.type, selectedOption.id),
              instance,
            })
          } else {
            const instance: SerializedActivatableInstance = {
              level: option.level?.value,
              options: this.getActivatableOptions(optionIndex, 0)
                .filter(isNotNullish)
                .map(o => toJS(o)),
            }
            return Case("IncompleteActivatable", {
              id: Case(option.type, option.id),
              instance,
            })
          }
        })
        .filter(isNotNullish) ?? []
    )
  }
}

export class SelectedRCPOptions {
  readonly character: CharacterIPCSelectors

  readonly attributeAdjustment: SelectedAttributeAdjustment
  @observable accessor buyCulturalPackage = false
  readonly nativeTongueAndScript: SelectedNativeTongueAndScript
  readonly skillSpecialization: SelectedSkillSpecialization
  readonly languagesAndLiteracy: SelectedLanguagesAndLiteracy
  readonly skills: SelectedRatedForAP
  readonly combatTechniques: SelectedCombatTechniques
  readonly cantrips: SelectedCantrips
  readonly spellworks: SelectedMultiEntityRatedForAP<"Spell" | "Ritual">
  readonly curses: SelectedRatedForAP
  readonly liturgies: SelectedMultiEntityRatedForAP<"LiturgicalChant" | "Ceremony">
  readonly separate: SelectedOther

  constructor(character: CharacterIPCSelectors) {
    this.character = character
    this.attributeAdjustment = new SelectedAttributeAdjustment(character)
    this.nativeTongueAndScript = new SelectedNativeTongueAndScript(character)
    this.skillSpecialization = new SelectedSkillSpecialization(character)
    this.languagesAndLiteracy = new SelectedLanguagesAndLiteracy(character)
    this.skills = new SelectedRatedForAP(
      character,
      () =>
        mapNullable(
          this.character.raceCultureProfessionSelectOptions?.profession.skills,
          config => ({
            apValue: config.apValue,
            entries: config.skills,
          }),
        ),
      false,
    )
    this.combatTechniques = new SelectedCombatTechniques(character)
    this.cantrips = new SelectedCantrips(character)
    this.spellworks = new SelectedMultiEntityRatedForAP<"Spell" | "Ritual">(
      character,
      () =>
        mapNullable(
          this.character.raceCultureProfessionSelectOptions?.profession.spellworks,
          config => ({
            apValue: config.apValue,
            entries: config.spellworks,
            number: config.number,
          }),
        ),
      true,
    )
    this.curses = new SelectedRatedForAP(
      character,
      () =>
        mapNullable(
          this.character.raceCultureProfessionSelectOptions?.profession.curses,
          config => ({
            apValue: config.apValue,
            entries: config.curses,
          }),
        ),
      true,
    )
    this.liturgies = new SelectedMultiEntityRatedForAP<"LiturgicalChant" | "Ceremony">(
      character,
      () =>
        mapNullable(
          this.character.raceCultureProfessionSelectOptions?.profession.liturgies,
          config => ({
            apValue: config.apValue,
            entries: config.liturgies,
          }),
        ),
      true,
    )
    this.separate = new SelectedOther(character)
  }

  @computed
  get isValid(): boolean {
    const { raceCultureProfessionSelectOptions } = this.character

    if (raceCultureProfessionSelectOptions === undefined) {
      return false
    }

    return (
      this.attributeAdjustment.isValid &&
      this.nativeTongueAndScript.isValid &&
      this.skillSpecialization.isValid &&
      this.languagesAndLiteracy.isValid &&
      this.skills.isValid &&
      this.combatTechniques.isValid &&
      this.cantrips.isValid &&
      this.spellworks.isValid &&
      this.curses.isValid &&
      this.liturgies.isValid &&
      this.separate.isValid
    )
  }

  toSerialized() {
    return {
      attributeAdjustmentId: this.attributeAdjustment.attributeAdjustmentId,
      buyCulturalPackage: this.buyCulturalPackage,
      nativeTongue: this.nativeTongueAndScript.nativeTongue,
      buyScript: this.nativeTongueAndScript.buyScript,
      script: this.nativeTongueAndScript.script,
      skillSpecialization: this.skillSpecialization.skillSpecialization,
      skillSpecializationApplication: toJS(this.skillSpecialization.skillSpecializationApplication),
      languages: toJS(this.languagesAndLiteracy.languages),
      scripts: toJS(this.languagesAndLiteracy.scripts),
      skills: toJS(this.skills.rated),
      combatTechniques: this.combatTechniques.toSerialized(),
      cantrips: toJS(this.cantrips.cantrips),
      spellworks: toJS(this.spellworks.rated),
      curses: toJS(this.curses.rated),
      liturgies: toJS(this.liturgies.rated),
      separate: this.separate.toSerialized(),
    }
  }

  @action
  toggleCulturalPackage() {
    this.buyCulturalPackage = !this.buyCulturalPackage
  }
}

export type SerializedSelectedRCPOptions = ReturnType<SelectedRCPOptions["toSerialized"]>
