import type {
  FocusRule,
  FocusRule_ID,
  OptionalRule,
  OptionalRule_ID,
  Publication,
  Publication_ID,
} from "@optolith/database-schema/gen"
import {
  isEntryFromIncludedPublication,
  isPublicationIncluded,
  isPublicationIncludedInGroup,
  type PublicationOptions,
} from "@optolith/entity-descriptions/publication-options"
import { app } from "electron/main"
import { action, computed, observable } from "mobx"
import semver from "semver"
import type { Database } from "../database.ts"
import type { LocaleEnvironment } from "../utils/locale.ts"
import type { Character } from "./character.ts"
import { createFocusRule, type FocusRuleInstance } from "./rules/focusRule.ts"
import { createOptionalRule, type OptionalRuleInstance } from "./rules/optionalRule.ts"

export class CharacterRules {
  readonly #db: Database
  readonly #character: Character
  readonly #localeEnvironment: LocaleEnvironment

  /**
   * Whether the character makes use of all publications except for publications with adult content, which have to be specified explicitly using `include_publications`.
   */
  @observable accessor includeAllPublications: boolean

  /**
   * Explicitly used publications. If `include_all_publications` is set to `true`, only affects publications that are not covered by `include_all_publications`.
   */
  @observable accessor includePublications: Set<Publication_ID>

  //   /**
  //    * Dependencies on certain publications.
  //    */
  // @observable accessor   publicationDependencies: PublicationDependency[]

  /**
   * A map of focus rules that may be active for the character.
   */
  @observable accessor #focusRules: Record<FocusRule_ID, FocusRuleInstance>

  /**
   * A map of optional rules that maybe be active for the character.
   */
  @observable accessor #optionalRules: Record<OptionalRule_ID, OptionalRuleInstance>

  constructor(
    db: Database,
    character: Character,
    localeEnvironment: LocaleEnvironment,
    includeAllPublications: boolean,
    includePublications: Publication_ID[],
  ) {
    this.#db = db
    this.#character = character
    this.#localeEnvironment = localeEnvironment
    this.includeAllPublications = includeAllPublications
    this.includePublications = new Set(includePublications)
    this.#focusRules = {}
    this.#optionalRules = {}
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
  get publications(): CharacterPublicationOverview[] {
    const options = this.publicationOptions
    const { translateMap } = this.#localeEnvironment
    return this.#db
      .getAllInstanceContainersOfEntity("Publication")
      .map((publication): CharacterPublicationOverview => ({
        id: publication.id,
        dbEntry: publication.content,
        active: isPublicationIncluded(translateMap, options, publication.id, publication.content),
        disabled: isPublicationIncludedInGroup(publication.content, options.showPublicationGroups), // TODO: Dependencies
      }))
  }

  @computed
  get focusRules(): CharacterFocusRuleOverview[] {
    return this.#db
      .getAllInstanceContainersOfEntity("FocusRule")
      .filter(focusRule =>
        isEntryFromIncludedPublication(
          focusRule.content,
          this.#db.getInstanceOfEntityById.bind(this.#db),
          this.#localeEnvironment.translateMap,
          this.publicationOptions,
        ),
      )
      .map((focusRule): CharacterFocusRuleOverview => ({
        id: focusRule.id,
        dbEntry: focusRule.content,
        active: this.#focusRules[focusRule.id]?.active ?? false,
        disabled: focusRule.content.isMissingImplementation, // TODO: Dependencies
      }))
  }

  @computed
  get optionalRules(): CharacterOptionalRuleOverview[] {
    return this.#db
      .getAllInstanceContainersOfEntity("OptionalRule")
      .filter(optionalRule =>
        isEntryFromIncludedPublication(
          optionalRule.content,
          this.#db.getInstanceOfEntityById.bind(this.#db),
          this.#localeEnvironment.translateMap,
          this.publicationOptions,
        ),
      )
      .map((optionalRule): CharacterOptionalRuleOverview => ({
        id: optionalRule.id,
        dbEntry: optionalRule.content,
        active: this.#optionalRules[optionalRule.id]?.active ?? false,
        disabled: optionalRule.content.isMissingImplementation, // TODO: Dependencies
      }))
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
    const focusRule = (this.#focusRules[id] ??= createFocusRule(id))
    focusRule.active = !focusRule.active
  }

  @action
  toggleOptionalRule(id: OptionalRule_ID): void {
    const optionalRule = (this.#optionalRules[id] ??= createOptionalRule(id))
    optionalRule.active = !optionalRule.active
  }
}

export type CharacterPublicationOverview = {
  id: string
  dbEntry: Publication
  active: boolean
  disabled: boolean
}

export type CharacterFocusRuleOverview = {
  id: string
  dbEntry: FocusRule
  active: boolean
  disabled: boolean
}

export type CharacterOptionalRuleOverview = {
  id: string
  dbEntry: OptionalRule
  active: boolean
  disabled: boolean
}
