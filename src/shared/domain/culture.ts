import type { Culture as RawCulture } from "@optolith/character-schema/types"
import type { ActivatableIdentifier, Culture, Culture_ID } from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { TranslateMap } from "../utils/locale.ts"

export class CharacterCulture {
  readonly global: Global

  /**
   * The culture identifier.
   */
  @observable accessor id: Culture_ID

  /**
   * Describes whether the cultural package has been applied when creating the character.
   */
  @observable accessor isCulturalPackageApplied: boolean

  /**
   * Dependencies on the selected culture.
   */
  @observable accessor dependencies: CultureDependency[]

  constructor(
    global: Global,
    id: Culture_ID,
    isCulturalPackageApplied: boolean = false,
    dependencies: CultureDependency[] = [],
  ) {
    this.global = global
    this.id = id
    this.isCulturalPackageApplied = isCulturalPackageApplied
    this.dependencies = dependencies
  }

  @computed
  get base(): Culture | undefined {
    return this.global.db.getInstanceOfEntityById("Culture", this.id)
  }

  @computed
  get name(): string | undefined {
    return this.global.locale.translateMap(this.base?.translations)?.name
  }

  static fromJSON(global: Global, raw: RawCulture): CharacterCulture {
    return new CharacterCulture(global, raw.base, raw.isCulturalPackageApplied)
  }

  toJSON(): RawCulture {
    return {
      base: this.id,
      isCulturalPackageApplied: this.isCulturalPackageApplied,
    }
  }
}

/**
 * Returns a culture by id.
 */
export const getCulture = (cultures: Record<number, Culture>, id: number): Culture | undefined =>
  cultures[id]

/**
 * Returns the full name of a culture.
 */
export const getFullCultureName = (translateMap: TranslateMap, culture: Culture): string =>
  translateMap(culture.translations)?.name ?? ""

/**
 * A dependency on a culture.
 */
export type CultureDependency = Readonly<{
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
   * The required culture's identifier.
   */
  id: Culture_ID
}>
