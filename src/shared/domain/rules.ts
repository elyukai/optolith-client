import { ensureNonEmpty, isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Rules as RawRules } from "@optolith/character-schema/types"
import type {
  ActivatableIdentifier,
  AlternativeRule_ID,
  EntityMap,
  ExtensionRuleIdentifier,
  FocusRule_ID,
  OptionalRule_ID,
  OptionalRuleOption_ID,
  Publication_ID,
  PublicationCategory,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import type { RenderingOptions } from "@optolith/entity-descriptions"
import {
  isEntryFromIncludedPublication,
  isPublicationIncluded,
  isPublicationIncludedInGroup,
  type PublicationOptions,
} from "@optolith/entity-descriptions/publication-options"
import { app } from "electron/main"
import { action, computed, observable, toJS } from "mobx"
import semver from "semver"
import type { Global } from "../global.ts"
import type { BaseCharacter } from "./character.ts"
import {
  addOrRemoveDependency,
  type RegistrationMethod,
} from "./dependencies/registrationHelpers.ts"
import { checkMultipleDisjunctionPartsAreValid } from "./prerequisites/disjunctionPrerequisiteMultipartValidation.ts"

abstract class CharacterRule<Entity extends "FocusRule" | "OptionalRule" | "AlternativeRule"> {
  readonly global: Global
  readonly character: BaseCharacter
  readonly id: string
  readonly entityName: Entity
  readonly dbEntry: EntityMap[Entity]

  @observable accessor active: boolean
  @observable accessor dependencies: RuleDependency[] = []

  constructor(
    global: Global,
    character: BaseCharacter,
    entityName: Entity,
    id: string,
    active = false,
    dbEntry: EntityMap[Entity] | undefined = global.db.getInstanceOfEntityById(entityName, id),
  ) {
    this.global = global
    this.character = character
    this.id = id
    this.entityName = entityName
    if (!dbEntry) {
      throw new Error(`${entityName} with id ${id} not found in database.`)
    }
    this.dbEntry = dbEntry
    this.active = active
  }

  toJSON(): { id: string } {
    return { id: this.id }
  }

  toSerialized() {
    return {
      id: this.id,
      active: this.active,
      name: this.global.locale.translateMap(this.dbEntry.translations)?.name ?? "",
      disabled: this.isDisabled,
    }
  }

  @computed
  get isDependedOn(): boolean {
    return this.dependencies.some(dep => dep.active === this.active)
  }

  get isDisabled(): boolean {
    return this.dbEntry.isMissingImplementation || this.isDependedOn
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): RuleDependency[] {
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

export class CharacterFocusRule extends CharacterRule<"FocusRule"> {}

export class CharacterOptionalRule extends CharacterRule<"OptionalRule"> {
  /**
   * An array of one or more options. The exact meaning of each option varies based on the optional rule.
   */
  @observable accessor options: string[] = []

  override toSerialized() {
    return {
      ...super.toSerialized(),
      options: this.optionsForDisplay,
      activeOptions: toJS(this.options),
    }
  }

  @computed
  get optionsForDisplay(): DisplayedOptionalRuleOption[] | undefined {
    const { translateMap, compare } = this.global.locale
    return ensureNonEmpty(
      this.global.db.getAllChildInstanceContainersForParent("OptionalRuleOption", this.id),
    )
      ?.map(option => ({
        id: option.id,
        name: translateMap(option.content.translations)?.name ?? "",
      }))
      .toSorted(on(option => option.name, compare))
  }

  @computed
  get optionValue(): number | undefined {
    const option =
      this.active && isNotEmpty(this.options)
        ? this.global.db.getInstanceOfEntityById("OptionalRuleOption", this.options[0])
        : undefined
    if (option === undefined) {
      return undefined
    }
    return option.value
  }

  override toJSON(): { id: string; options?: string[] } {
    return {
      ...super.toJSON(),
      options: ensureNonEmpty(this.options),
    }
  }
}

export class CharacterAlternativeRule extends CharacterRule<"AlternativeRule"> {}

abstract class CharacterRuleCollection<
  Entity extends "FocusRule" | "OptionalRule" | "AlternativeRule",
  T extends CharacterRule<Entity>,
> {
  readonly global: Global
  readonly character: BaseCharacter
  readonly entityName: Entity
  readonly creator: new (
    global: Global,
    character: BaseCharacter,
    entityName: Entity,
    id: string,
    active?: boolean,
    dbEntry?: EntityMap[Entity],
  ) => T

  @observable accessor rules: Map<string, T>

  constructor(
    global: Global,
    character: BaseCharacter,
    entityName: Entity,
    creator: typeof this.creator,
    rules?: Map<string, T>,
  ) {
    this.global = global
    this.character = character
    this.entityName = entityName
    this.creator = creator
    if (rules === undefined) {
      this.rules = new Map()
      for (const rule of this.global.db.getAllInstanceContainersOfEntity(entityName)) {
        this.rules.set(
          rule.id,
          new this.creator(global, character, entityName, rule.id, false, rule.content),
        )
      }
    } else {
      this.rules = rules
    }
  }

  @computed
  get rulesForDisplay(): ReturnType<T["toSerialized"]>[] {
    return this.rules
      .values()
      .filter(rule =>
        isEntryFromIncludedPublication(
          rule.dbEntry,
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.character.rules.publicationOptions,
        ),
      )
      .map(rule => rule.toSerialized() as ReturnType<T["toSerialized"]>)
      .toArray()
  }

  ensureEntryExists(id: string): T {
    return this.rules.getOrInsertComputed(
      id,
      () => new this.creator(this.global, this.character, this.entityName, id),
    )
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: RuleDependency) {
    const entry = this.ensureEntryExists(id)
    addOrRemoveDependency(method, entry.dependencies, dependency)
  }

  @action
  toggle(id: string): T {
    const rule = this.ensureEntryExists(id)
    rule.active = !rule.active
    return rule
  }

  isActive(id: string): boolean {
    return this.rules.get(id)?.active ?? false
  }

  toJSON(): ReturnType<T["toJSON"]>[] | undefined {
    return ensureNonEmpty(
      this.rules
        .values()
        .filter(rule => rule.active)
        .map(rule => rule.toJSON() as ReturnType<T["toJSON"]>)
        .toArray(),
    )
  }
}

class CharacterFocusRuleCollection extends CharacterRuleCollection<
  "FocusRule",
  CharacterFocusRule
> {
  constructor(global: Global, character: BaseCharacter, rules?: Map<string, CharacterFocusRule>) {
    super(global, character, "FocusRule", CharacterFocusRule, rules)
    // "34f44742-03ce-49b6-8930-b83d25ecc39c": {
    //   id: "34f44742-03ce-49b6-8930-b83d25ecc39c", // Spell Enhancements
    //   active: true,
    //   dependencies: [],
    // },
    // "00c0b31b-f3f7-4590-9be7-2dd2ba39171b": {
    //   id: "00c0b31b-f3f7-4590-9be7-2dd2ba39171b", // Liturgical Chant Enhancements
    //   active: true,
    //   dependencies: [],
    // },
  }
}

class CharacterOptionalRuleCollection extends CharacterRuleCollection<
  "OptionalRule",
  CharacterOptionalRule
> {
  constructor(
    global: Global,
    character: BaseCharacter,
    rules?: Map<string, CharacterOptionalRule>,
  ) {
    super(global, character, "OptionalRule", CharacterOptionalRule, rules)
  }

  getOptionValue(id: string): number | undefined {
    return this.rules.get(id)?.optionValue
  }

  setOption(id: string, optionId: string): void {
    const rule = this.ensureEntryExists(id)
    rule.options[0] = optionId
  }

  @action
  override toggle(id: string): CharacterOptionalRule {
    const rule = super.toggle(id)
    if (rule.optionsForDisplay !== undefined && isNotEmpty(rule.optionsForDisplay)) {
      rule.options[0] = rule.optionsForDisplay[0].id
    }
    return rule
  }
}

class CharacterAlternativeRuleCollection extends CharacterRuleCollection<
  "AlternativeRule",
  CharacterAlternativeRule
> {
  constructor(
    global: Global,
    character: BaseCharacter,
    rules?: Map<string, CharacterAlternativeRule>,
  ) {
    super(global, character, "AlternativeRule", CharacterAlternativeRule, rules)
  }
}

/**
 * A dependency on a rule being active.
 */
export type RuleDependency = {
  /**
   * The identifier of the entry that depends on the rule.
   */
  sourceId: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The index of the prerequisite in the source entry.
   */
  index: number

  /**
   * Whether the prerequisite is part of a disjunction. This is used as a cache
   * to avoid having to check the source entry every time you need to check
   * whether the prerequisite is part of a disjunction.
   */
  isPartOfDisjunction: boolean

  active: boolean
}

/**
 * A dependency on a publication.
 */
export type PublicationDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  sourceId: Publication_ID

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
   * The identifier of the required publication.
   */
  id: Publication_ID
}>

export class CharacterRules {
  readonly global: Global

  /**
   * Whether the character makes use of all publications except for publications with adult content, which have to be specified explicitly using `include_publications`.
   */
  @observable accessor includeAllPublications = false

  /**
   * Explicitly used publications. If `include_all_publications` is set to `true`, only affects publications that are not covered by `include_all_publications`.
   */
  @observable accessor includePublications: Set<Publication_ID> = new Set()

  /**
   * Dependencies on certain publications.
   */
  @observable accessor publicationDependencies: PublicationDependency[] = []

  /**
   * A map of focus rules that may be active for the character.
   */
  readonly focusRules: CharacterFocusRuleCollection

  /**
   * A map of optional rules that maybe be active for the character.
   */
  readonly optionalRules: CharacterOptionalRuleCollection

  /**
   * A map of optional rules that maybe be active for the character.
   */
  readonly alternativeRules: CharacterAlternativeRuleCollection

  constructor(
    global: Global,
    character: BaseCharacter,
    includeAllPublications = false,
    includePublications?: Publication_ID[] | Set<Publication_ID>,
    focusRules?: Map<string, CharacterFocusRule>,
    optionalRules?: Map<string, CharacterOptionalRule>,
    alternativeRules?: Map<string, CharacterAlternativeRule>,
  ) {
    this.global = global
    this.includeAllPublications = includeAllPublications
    this.includePublications = new Set(includePublications)
    this.focusRules = new CharacterFocusRuleCollection(global, character, focusRules)
    this.optionalRules = new CharacterOptionalRuleCollection(global, character, optionalRules)
    this.alternativeRules = new CharacterAlternativeRuleCollection(
      global,
      character,
      alternativeRules,
    )
  }

  @computed
  get publicationOptions(): PublicationOptions {
    return {
      publications: this.includePublications.values().toArray(),
      showPublicationGroups: this.includeAllPublications ? "playerOriented" : "core",
      changeHandling: "latestOnly",
      onlyCompletePublications: semver.prerelease(app.getVersion()) === null,
      onlyShowReferencesToIncludedPublications: true,
    }
  }

  @computed
  get renderingOptions(): Partial<RenderingOptions> {
    return {
      renderLiturgicalChantEnhancements: this.isFocusRuleActive(
        this.global.settings.liturgicalChants.enhancementsFocusRule,
      ),
      renderSpellEnhancements: this.isFocusRuleActive(
        this.global.settings.spellworks.enhancementsFocusRule,
      ),
    }
  }

  @computed
  get publications(): CharacterPublicationOverview[] {
    const options = this.publicationOptions
    const { translateMap } = this.global.locale
    return this.global.db
      .getAllInstanceContainersOfEntity("Publication")
      .map((publication): CharacterPublicationOverview | undefined => {
        const translation = translateMap(publication.content.translations)
        if (translation === undefined) {
          return undefined
        }
        return {
          id: publication.id,
          name: translation.name ?? "",
          category: publication.content.category,
          containsAdultContent: publication.content.containsAdultContent,
          explicityActive: this.includePublications.has(publication.id),
          active: isPublicationIncluded(translation, options, publication.id, publication.content),
          disabled: isPublicationIncludedInGroup(
            publication.content,
            options.showPublicationGroups,
          ), // TODO: Dependencies
        }
      })
      .filter(isNotNullish)
  }

  @computed
  get focusRulesForDisplay(): CharacterFocusRuleOverview[] {
    return this.focusRules.rulesForDisplay
  }

  @computed
  get optionalRulesForDisplay(): CharacterOptionalRuleOverview[] {
    return this.optionalRules.rulesForDisplay
  }

  @computed
  get alternativeRulesForDisplay(): DisplayedAlternativeRule[] {
    return this.alternativeRules.rulesForDisplay
  }

  @action
  toggleIncludeAllPublications(): void {
    this.includeAllPublications = !this.includeAllPublications
  }

  @action
  togglePublication(id: Publication_ID): void {
    if (this.includePublications.has(id)) {
      this.includePublications.delete(id)
    } else {
      this.includePublications.add(id)
    }
  }

  @action
  toggleFocusRule(id: FocusRule_ID): void {
    this.focusRules.toggle(id)
  }

  @action
  toggleOptionalRule(id: OptionalRule_ID): void {
    this.optionalRules.toggle(id)
  }

  @action
  setOptionalRuleOption(id: OptionalRule_ID, optionId: OptionalRuleOption_ID): void {
    this.optionalRules.setOption(id, optionId)
  }

  @action
  toggleAlternativeRule(id: AlternativeRule_ID): void {
    this.alternativeRules.toggle(id)
  }

  isFocusRuleActive(id: FocusRule_ID): boolean {
    return this.focusRules.isActive(id)
  }

  isOptionalRuleActive(id: OptionalRule_ID): boolean {
    return this.optionalRules.isActive(id)
  }

  isAlternativeRuleActive(id: AlternativeRule_ID): boolean {
    return this.alternativeRules.isActive(id)
  }

  addOrRemoveRuleDependency(
    id: ExtensionRuleIdentifier,
    method: RegistrationMethod,
    dependency: RuleDependency,
  ) {
    switch (id.kind) {
      case "FocusRule":
        this.focusRules.addOrRemoveDependency(id.FocusRule, method, dependency)
        break
      case "OptionalRule":
        this.optionalRules.addOrRemoveDependency(id.OptionalRule, method, dependency)
        break
      default:
        return assertExhaustive(id)
    }
  }

  static fromJSON(global: Global, character: BaseCharacter, raw: RawRules): CharacterRules {
    const rules = new CharacterRules(
      global,
      character,
      raw.includeAllPublications,
      raw.includePublications,
    )
    raw.focusRules?.forEach(rawRule => {
      const rule = rules.focusRules.ensureEntryExists(rawRule.id)
      rule.active = true
    })
    raw.optionalRules?.forEach(rawRule => {
      const rule = rules.optionalRules.ensureEntryExists(rawRule.id)
      rule.active = true
      rule.options = rawRule.options ?? []
    })
    raw.alternativeRules?.forEach(rawRule => {
      const rule = rules.alternativeRules.ensureEntryExists(rawRule.id)
      rule.active = true
    })
    return rules
  }

  toJSON(): RawRules {
    return {
      includeAllPublications: this.includeAllPublications,
      includePublications: this.publications.filter(pub => pub.explicityActive).map(pub => pub.id),
      focusRules: this.focusRules.toJSON(),
      optionalRules: this.optionalRules.toJSON(),
      alternativeRules: this.alternativeRules.toJSON(),
    }
  }
}

export type CharacterPublicationOverview = {
  id: string
  name: string
  category: PublicationCategory
  containsAdultContent: boolean
  explicityActive: boolean
  active: boolean
  disabled: boolean
}

export type CharacterFocusRuleOverview = {
  id: string
  name: string
  active: boolean
  disabled: boolean
}

export type DisplayedOptionalRuleOption = {
  id: string
  name: string
}

export type CharacterOptionalRuleOverview = {
  id: string
  name: string
  active: boolean
  disabled: boolean
  options?: DisplayedOptionalRuleOption[]
  activeOptions: string[]
}

export type DisplayedAlternativeRule = {
  id: string
  name: string
  active: boolean
  disabled: boolean
}
