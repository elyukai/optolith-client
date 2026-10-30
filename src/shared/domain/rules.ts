import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  EntityMap,
  ExtensionRuleIdentifier,
  FocusRule_ID,
  OptionalRule_ID,
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
import { action, computed, observable } from "mobx"
import semver from "semver"
import type { Global } from "../global.ts"
import {
  addOrRemoveDependency,
  type RegistrationMethod,
} from "./dependencies/registrationHelpers.ts"
import type { PublicationDependency } from "./sources/publicationDependency.ts"

abstract class CharacterRule<Entity extends "FocusRule" | "OptionalRule"> {
  readonly global: Global
  readonly id: string
  readonly entityName: Entity
  readonly dbEntry: EntityMap[Entity]

  @observable accessor active: boolean
  @observable accessor dependencies: RuleDependency[]

  constructor(
    global: Global,
    entityName: Entity,
    id: string,
    active: boolean = false,
    dbEntry: EntityMap[Entity] | undefined = global.db.getInstanceOfEntityById(entityName, id),
    dependencies: RuleDependency[] = [],
  ) {
    this.global = global
    this.id = id
    this.entityName = entityName
    if (!dbEntry) {
      throw new Error(`${entityName} with id ${id} not found in database.`)
    }
    this.dbEntry = dbEntry
    this.active = active
    this.dependencies = dependencies
  }

  toJSON() {
    return {
      id: this.id,
      active: this.active,
      name: this.global.locale.translateMap(this.dbEntry.translations)?.name ?? "",
      disabled: this.dbEntry.isMissingImplementation, // TODO: Dependencies
    }
  }
}

export class CharacterFocusRule extends CharacterRule<"FocusRule"> {}

export class CharacterOptionalRule extends CharacterRule<"OptionalRule"> {
  /**
   * An array of one or more options. The exact meaning of each option varies based on the optional rule.
   */
  @observable accessor options: string[] | undefined

  override toJSON() {
    return {
      ...super.toJSON(),
      options: this.options,
    }
  }
}

abstract class CharacterRuleCollection<
  Entity extends "FocusRule" | "OptionalRule",
  T extends CharacterRule<Entity>,
> {
  readonly global: Global
  readonly parent: CharacterRules
  readonly entityName: Entity
  readonly creator: new (
    global: Global,
    entityName: Entity,
    id: string,
    active?: boolean,
    dbEntry?: EntityMap[Entity],
  ) => T

  @observable accessor rules: Map<string, T>

  constructor(
    global: Global,
    parent: CharacterRules,
    entityName: Entity,
    creator: typeof this.creator,
  ) {
    this.global = global
    this.parent = parent
    this.entityName = entityName
    this.creator = creator
    this.rules = new Map()
  }

  @computed
  get rulesForDisplay(): ReturnType<T["toJSON"]>[] {
    return this.global.db
      .getAllInstanceContainersOfEntity(this.entityName)
      .filter(rule =>
        isEntryFromIncludedPublication(
          rule.content,
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.parent.publicationOptions,
        ),
      )
      .map(
        rule =>
          (
            this.rules.get(rule.id) ??
            new this.creator(this.global, this.entityName, rule.id, false, rule.content)
          ).toJSON() as ReturnType<T["toJSON"]>,
      )
  }

  protected ensureEntryExists(id: string): T {
    return this.rules.getOrInsertComputed(
      id,
      () => new this.creator(this.global, this.entityName, id),
    )
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: RuleDependency) {
    const entry = this.ensureEntryExists(id)
    addOrRemoveDependency(method, entry.dependencies, dependency)
  }

  @action
  toggle(id: string): void {
    const rule = this.ensureEntryExists(id)
    rule.active = !rule.active
  }

  isActive(id: string): boolean {
    return this.rules.get(id)?.active ?? false
  }
}

class CharacterFocusRuleCollection extends CharacterRuleCollection<
  "FocusRule",
  CharacterFocusRule
> {
  constructor(global: Global, parent: CharacterRules) {
    super(global, parent, "FocusRule", CharacterFocusRule)
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
  constructor(global: Global, parent: CharacterRules) {
    super(global, parent, "OptionalRule", CharacterOptionalRule)
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

export class CharacterRules {
  readonly global: Global

  /**
   * Whether the character makes use of all publications except for publications with adult content, which have to be specified explicitly using `include_publications`.
   */
  @observable accessor includeAllPublications: boolean

  /**
   * Explicitly used publications. If `include_all_publications` is set to `true`, only affects publications that are not covered by `include_all_publications`.
   */
  @observable accessor includePublications: Set<Publication_ID>

  /**
   * Dependencies on certain publications.
   */
  @observable accessor publicationDependencies: PublicationDependency[]

  /**
   * A map of focus rules that may be active for the character.
   */
  readonly focusRules: CharacterFocusRuleCollection

  /**
   * A map of optional rules that maybe be active for the character.
   */
  readonly optionalRules: CharacterOptionalRuleCollection

  constructor(
    global: Global,
    includeAllPublications: boolean,
    includePublications: Publication_ID[],
  ) {
    this.global = global
    this.includeAllPublications = includeAllPublications
    this.includePublications = new Set(includePublications)
    this.publicationDependencies = []
    this.focusRules = new CharacterFocusRuleCollection(global, this)
    this.optionalRules = new CharacterOptionalRuleCollection(global, this)
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
      .map((publication): CharacterPublicationOverview => ({
        id: publication.id,
        name: this.global.locale.translateMap(publication.content.translations)?.name ?? "",
        category: publication.content.category,
        containsAdultContent: publication.content.containsAdultContent,
        active: isPublicationIncluded(translateMap, options, publication.id, publication.content),
        disabled: isPublicationIncludedInGroup(publication.content, options.showPublicationGroups), // TODO: Dependencies
      }))
  }

  @computed
  get focusRulesForDisplay(): CharacterFocusRuleOverview[] {
    return this.focusRules.rulesForDisplay
  }

  @computed
  get optionalRulesForDisplay(): CharacterOptionalRuleOverview[] {
    return this.optionalRules.rulesForDisplay
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

  isFocusRuleActive(id: FocusRule_ID): boolean {
    return this.focusRules.isActive(id)
  }

  isOptionalRuleActive(id: OptionalRule_ID): boolean {
    return this.optionalRules.isActive(id)
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
}

export type CharacterPublicationOverview = {
  id: string
  name: string
  category: PublicationCategory
  containsAdultContent: boolean
  active: boolean
  disabled: boolean
}

export type CharacterFocusRuleOverview = {
  id: string
  name: string
  active: boolean
  disabled: boolean
}

export type CharacterOptionalRuleOverview = {
  id: string
  name: string
  active: boolean
  disabled: boolean
}
