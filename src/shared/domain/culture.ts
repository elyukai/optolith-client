import { ensureNonEmpty, type NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { sumWith } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import type { Lazy } from "@elyukai/utils/lazy"
import { Reader } from "@elyukai/utils/reader"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { getAdventurePointsForRatingRange } from "@optolith/adventure-points/improvement-cost"
import type { Culture as RawCulture } from "@optolith/character-schema/types"
import type {
  ActivatableIdentifier,
  BlessedCommonProfessionConstraint,
  BlessedTradition,
  BlessedTraditionConstraint,
  BlessedTraditionGroupConstraint,
  CommonProfessionConstraints,
  CommonProfessions,
  Culture,
  Culture_ID,
  GroupedCommonProfessions,
  Language_ID,
  MagicalTradition,
  MagicalTraditionConstraint,
  MagicCommonProfessionConstraint,
  MundaneCommonProfessionConstraint,
  PlainCommonProfessions,
  Profession,
  Profession_ID,
  ProfessionConstraint,
  Script_ID,
} from "@optolith/database-schema/gen"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed, observable } from "mobx"
import type { Database } from "../database.ts"
import type { Global } from "../global.ts"
import type { BaseCharacter } from "./character.ts"
import { Case } from "./databaseEnum.ts"

export class CharacterCulture {
  readonly global: Global
  character: BaseCharacter

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
    character: BaseCharacter,
    ...args:
      | [raw: RawCulture]
      | [id: Culture_ID, isCulturalPackageApplied: boolean, dependencies: CultureDependency[]]
  ) {
    this.global = global
    this.character = character
    this.id = args.length === 1 ? args[0].base : args[0]
    this.isCulturalPackageApplied = args.length === 1 ? args[0].isCulturalPackageApplied : args[1]
    this.dependencies = args.length === 1 ? [] : args[2]
  }

  @computed
  get base(): Culture | undefined {
    return this.global.db.getInstanceOfEntityById("Culture", this.id)
  }

  @computed
  get name(): string | undefined {
    return this.global.locale.translateMap(this.base?.translations)?.name
  }

  static getCulturesForDisplay(baseCharacter: BaseCharacter): CultureForDisplay[] {
    return baseCharacter.global.db
      .getAllInstanceContainersOfEntity("Culture")
      .filter(
        culture =>
          isEntryFromIncludedPublication(
            culture.content,
            baseCharacter.global.db.getInstanceOfEntityById.bind(baseCharacter.global.db),
            baseCharacter.global.locale.translateMap,
            baseCharacter.rules.publicationOptions,
          ) &&
          (baseCharacter.race?.variant?.common_cultures?.includes(culture.id) ?? true),
      )
      .map(culture => ({
        id: culture.id,
        name:
          baseCharacter.global.locale.translateMap(culture.content.translations)?.name ??
          culture.id,
        apValue: getAPValueForCulturalPackage(culture.content, baseCharacter.global.db),
      }))
  }

  @computed
  get selectOptions(): DisplayedCultureSelectOptions {
    if (this.base === undefined) {
      return {}
    }

    return {
      culturalPackageAPValue: getAPValueForCulturalPackage(this.base, this.global.db),
      nativeTongue: ensureNonEmpty(this.base.language)
        ?.map(lang => ({
          id: lang.id,
          name:
            this.global.locale.translateMap(
              this.global.db.getInstanceOfEntityById("Language", lang.id)?.translations,
            )?.name ?? MISSING_VALUE,
        }))
        .toSorted(on(attr => attr.name, this.global.locale.compare)),
      scripts:
        this.base.script === undefined
          ? undefined
          : ensureNonEmpty(this.base.script)?.map(script => {
              const entry = this.global.db.getInstanceOfEntityById("Script", script)
              return {
                id: script,
                name: this.global.locale.translateMap(entry?.translations)?.name ?? MISSING_VALUE,
                apValue: entry?.ap_value ?? 0,
              }
            }),
    }
  }

  getCommonProfessionPredicate(): (env: CommonProfessionEnv) => boolean {
    const commonProfessions: CommonProfessions =
      this.base?.common_professions ??
      Case("Plain", { constraints: [], operation: Case("Difference") })

    return env => matchesCommonProfessions(commonProfessions).run(env)
  }

  toJSON(): RawCulture {
    return {
      base: this.id,
      isCulturalPackageApplied: this.isCulturalPackageApplied,
    }
  }
}

const getAPValueForCulturalPackage = (culture: Culture, db: Database) =>
  sumWith(culture.cultural_package, item =>
    getAdventurePointsForRatingRange(
      db.getInstanceOfEntityById("Skill", item.id)?.improvement_cost.kind ?? "A",
      0,
      item.points,
    ),
  )

export type DisplayedCultureSelectOptions = {
  culturalPackageAPValue?: number
  nativeTongue?: NonEmptyArray<{ id: Language_ID; name: string }>
  scripts?: NonEmptyArray<{ id: Script_ID; name: string; apValue: number }>
}

export type CommonProfessionEnv = {
  id: Profession_ID
  profession: Profession
  magicalTraditions: Lazy<{ id: string; content: MagicalTradition }[]>
  blessedTraditions: Lazy<{ id: string; content: BlessedTradition }[]>
}

type CommonProfessionReader = Reader<CommonProfessionEnv, boolean>

const matchesCommonProfessions = (commonProfessions: CommonProfessions): CommonProfessionReader => {
  switch (commonProfessions.kind) {
    case "Plain":
      return matchesPlainCommonProfessionConstraint(commonProfessions.Plain)
    case "Grouped":
      return matchesGroupedCommonProfessionConstraint(commonProfessions.Grouped)
    default:
      return assertExhaustive(commonProfessions)
  }
}

const matchesPlainCommonProfessionConstraint = (
  constraint: PlainCommonProfessions,
): CommonProfessionReader =>
  matchesCommonProfessionConstraints(constraint, id => matchesProfessionConstraint({ id }))

const matchesGroupedCommonProfessionConstraint = (
  constraint: GroupedCommonProfessions,
): CommonProfessionReader =>
  Reader.asks(
    env =>
      (constraint.mundane === undefined
        ? false
        : matchesCommonProfessionConstraints(
            constraint.mundane,
            matchesMundaneCommonProfessionConstraint,
          ).run(env)) ||
      (constraint.magic === undefined
        ? false
        : matchesCommonProfessionConstraints(
            constraint.magic,
            matchesMagicCommonProfessionConstraint,
          ).run(env)) ||
      (constraint.blessed === undefined
        ? false
        : matchesCommonProfessionConstraints(
            constraint.blessed,
            matchesBlessedCommonProfessionConstraint,
          ).run(env)),
  )

const matchesCommonProfessionConstraints = <T>(
  spec: CommonProfessionConstraints<T>,
  test: (constraint: T) => CommonProfessionReader,
): CommonProfessionReader => {
  switch (spec.operation.kind) {
    case "Intersection":
      return Reader.asks(env => spec.constraints.some(constraint => test(constraint).run(env)))
    case "Difference":
      return Reader.asks(env => !spec.constraints.some(constraint => test(constraint).run(env)))
    default:
      return assertExhaustive(spec.operation)
  }
}

const matchesMundaneCommonProfessionConstraint = (
  constraint: MundaneCommonProfessionConstraint,
): CommonProfessionReader => matchesProfessionConstraint(constraint.Profession)

const matchesMagicCommonProfessionConstraint = (
  constraint: MagicCommonProfessionConstraint,
): CommonProfessionReader => {
  switch (constraint.kind) {
    case "Profession":
      return matchesProfessionConstraint(constraint.Profession)
    case "Tradition":
      return matchesMagicalTraditionConstraint(constraint.Tradition)
    case "MagicDilettante":
      return matchesMagicDilettanteConstraint
    default:
      return assertExhaustive(constraint)
  }
}

const matchesBlessedCommonProfessionConstraint = (
  constraint: BlessedCommonProfessionConstraint,
): CommonProfessionReader => {
  switch (constraint.kind) {
    case "Profession":
      return matchesProfessionConstraint(constraint.Profession)
    case "Tradition":
      return matchesBlessedTraditionConstraint(constraint.Tradition)
    case "Group":
      return matchesBlessedTraditionGroupConstraint(constraint.Group)
    case "Religious":
      return matchesReligiousConstraint
    default:
      return assertExhaustive(constraint)
  }
}

const matchesProfessionConstraint = (constraint: ProfessionConstraint): CommonProfessionReader =>
  Reader.asks(({ id }) => constraint.id === id)

const matchesMagicalTraditionConstraint = (
  constraint: MagicalTraditionConstraint,
): CommonProfessionReader =>
  Reader.asks(({ magicalTraditions }) =>
    magicalTraditions.value.some(trad => trad.id === constraint.id),
  )

const matchesMagicDilettanteConstraint: CommonProfessionReader = Reader.asks(
  ({ magicalTraditions }) =>
    magicalTraditions.value.some(trad => trad.content.is_magical_dilettante),
)

const matchesBlessedTraditionConstraint = (
  constraint: BlessedTraditionConstraint,
): CommonProfessionReader =>
  Reader.asks(({ blessedTraditions }) =>
    blessedTraditions.value.some(trad => trad.id === constraint.id),
  )

const matchesBlessedTraditionGroupConstraint = (
  constraint: BlessedTraditionGroupConstraint,
): CommonProfessionReader =>
  Reader.asks(({ blessedTraditions }) =>
    blessedTraditions.value.some(trad => trad.content.group === constraint.id),
  )

const matchesReligiousConstraint: CommonProfessionReader = Reader.asks(
  ({ profession }) => profession.group.kind === "Religious",
)

export type CultureForDisplay = Readonly<{
  id: Culture_ID
  name: string
  apValue: number
}>

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
