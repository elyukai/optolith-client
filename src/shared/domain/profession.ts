import { unique } from "@elyukai/utils/array/filters"
import { on } from "@elyukai/utils/function"
import {
  type Nullish,
  ensure,
  isNotNullish,
  mapNullable,
  nullableToArray,
} from "@elyukai/utils/nullable"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Profession as RawProfession } from "@optolith/character-schema/types"
import type {
  EntityMap,
  PrerequisitesElement,
  Profession,
  Profession_ID,
  ProfessionName,
  ProfessionPackage,
  ProfessionPackage_ID,
  ProfessionPrerequisiteGroup,
  ProfessionVariant,
  ProfessionVariant_ID,
  ProfessionVersion,
  ProfessionVersion_ID,
} from "@optolith/database-schema/gen"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { action, computed, observable } from "mobx"
import type { GetInstanceById } from "../database.ts"
import type { Global } from "../global.ts"
import type { BaseCharacter, Character } from "./character.ts"
import { fromUniformCase } from "./databaseEnum.ts"
import type { Sex } from "./sex.ts"

export class CharacterProfession {
  readonly global: Global
  character: BaseCharacter

  /**
   * The profession package identifier. Profession packages are values of a profession version for a specific experience level. Profession versions are part of the same profession but with slightly different values, such as in extension rule books existing professions might get an additional style special ability.
   */
  @observable accessor packageId: ProfessionPackage_ID

  /**
   * The profession variant identifier.
   */
  @observable accessor variantId: ProfessionVariant_ID | undefined

  /**
   * A custom name for the profession, if provided.
   */
  @observable accessor customName: string | undefined

  constructor(
    global: Global,
    character: BaseCharacter,
    packageId: ProfessionPackage_ID,
    variantId?: ProfessionVariant_ID,
    customName?: string,
  ) {
    this.global = global
    this.character = character
    this.packageId = packageId
    this.variantId = variantId
    this.customName = customName
  }

  @computed
  get base(): Profession | undefined {
    return this.baseId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("Profession", this.baseId)
  }

  @computed
  get baseId(): Profession_ID | undefined {
    return this.version?.profession
  }

  @computed
  get version(): ProfessionVersion | undefined {
    return this.versionId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("ProfessionVersion", this.versionId)
  }

  @computed
  get versionId(): ProfessionVersion_ID | undefined {
    return this.package?.profession_version
  }

  @computed
  get package(): ProfessionPackage | undefined {
    return this.global.db.getInstanceOfEntityById("ProfessionPackage", this.packageId)
  }

  @computed
  get variant(): ProfessionVariant | undefined {
    return this.variantId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("ProfessionVariant", this.variantId)
  }

  @computed
  get fullNameParts(): FullProfessionNameParts | undefined {
    if (this.version === undefined) {
      return undefined
    }

    const { sex } = this.character.personalData
    const { translateMap } = this.global.locale

    // TODO: if (profession.base.id === ProfessionIdentifier.OwnProfession) {
    //   const name =
    //     customName ?? professionNameToString(sex, translateMap(profession.translations)?.name) ?? ""

    //   return {
    //     name,
    //     fullName: name,
    //   }
    // }

    const versionTranslation = translateMap(this.version.translations)
    const variantTranslation = translateMap(this.variant?.translations)

    const name = professionNameToString(sex, versionTranslation?.name) ?? ""
    const subName = professionNameToString(sex, versionTranslation?.specification)
    const variantName = professionNameToString(sex, variantTranslation?.name)

    if (subName !== undefined || variantName !== undefined) {
      const specifications = [subName, variantName].filter(isNotNullish).join(", ")

      return {
        name,
        subName,
        variantName,
        fullName: name + parensIf(specifications),
      }
    } else {
      return {
        name,
        fullName: name,
      }
    }
  }

  @action
  setCustomProfessionName(newCustomProfessionName: string) {
    this.customName = newCustomProfessionName
  }

  @computed
  get professionVariantsForDisplay(): ProfessionVariantForDisplay[] {
    return (
      ensure(
        this.global.db.getAllChildInstanceContainersForParent("ProfessionVariant", this.packageId),
        list => list.length > 1,
      )
        ?.map(professionVariant => {
          const translation = this.global.locale.translateMap(
            professionVariant.content.translations,
          )
          return {
            id: professionVariant.id,
            name:
              translation === undefined
                ? professionVariant.id
                : professionNameToString(this.character.personalData.sex, translation.name),
          }
        })
        .toSorted(on(pv => pv.name, this.global.locale.compare)) ?? []
    )
  }

  @computed
  get isVariantSelectionRequired(): boolean {
    return this.package?.is_variant_selection_required ?? false
  }

  static fromJSON(global: Global, character: Character, raw: RawProfession): CharacterProfession {
    return new CharacterProfession(global, character, raw.package, raw.variant, raw.customName)
  }

  toJSON(): RawProfession {
    return {
      base: this.baseId ?? this.versionId ?? this.packageId,
      version: this.versionId ?? this.packageId,
      package: this.packageId,
      variant: this.variantId,
      customName: this.customName,
    }
  }
}

export type ProfessionForDisplay = Readonly<{
  id: ProfessionVersion_ID
  name: string
  apValue: number
  sources: string
  versionId: ProfessionVersion_ID
  packageId: ProfessionPackage_ID
}>

export type ProfessionVariantForDisplay = Readonly<{
  id: ProfessionVariant_ID
  name: string
}>

export const extractActivatableFromProfessionPackage = <
  E extends "MagicalTradition" | "BlessedTradition",
>(
  professionPackage: ProfessionPackage,
  entity: E,
  getById: GetInstanceById<E>,
): { id: string; content: EntityMap[E] }[] =>
  unique(
    professionPackage.prerequisites?.flatMap(p =>
      extractActivatableFromPrerequisiteElement(p, entity),
    ) ?? [],
  )
    .map(id => mapNullable(getById(entity, id), content => ({ id, content })))
    .filter(isNotNullish)

const extractActivatableFromPrerequisiteElement = <
  E extends "MagicalTradition" | "BlessedTradition",
>(
  prerequisiteElement: PrerequisitesElement<ProfessionPrerequisiteGroup>,
  entity: E,
) => {
  switch (prerequisiteElement.kind) {
    case "Disjunction":
      return prerequisiteElement.Disjunction.list
        .map(element => extractActivatableFromPrerequisite(element, entity))
        .filter(isNotNullish)
    case "Group":
      return prerequisiteElement.Group.list
        .map(element => extractActivatableFromPrerequisite(element, entity))
        .filter(isNotNullish)
    case "Single":
      return nullableToArray(extractActivatableFromPrerequisite(prerequisiteElement.Single, entity))
    default:
      return assertExhaustive(prerequisiteElement)
  }
}

const extractActivatableFromPrerequisite = <E extends "MagicalTradition" | "BlessedTradition">(
  prerequisite: ProfessionPrerequisiteGroup,
  entity: E,
) =>
  prerequisite.kind === "Activatable" && prerequisite.Activatable.id.kind === entity
    ? fromUniformCase(prerequisite.Activatable.id)
    : undefined

/**
 * Maps a profession name that may be different for different sexes to a string.
 */
export const professionNameToString = <T extends ProfessionName | undefined>(
  sex: Sex,
  professionName: T,
): string | Nullish<T> => {
  if (professionName === undefined || typeof professionName === "string") {
    return professionName as string | Nullish<T>
  } else {
    switch (sex.type) {
      case "Male":
        return professionName.male ?? professionName.default
      case "Female":
        return professionName.female ?? professionName.default
      case "BalThani":
      case "Tsajana":
      case "Custom":
        return professionName.default
      default:
        return assertExhaustive(sex)
    }
  }
}

/**
 * The parts of a full profession name.
 */
export type FullProfessionNameParts = {
  name: string
  subName?: string
  variantName?: string
  fullName: string
}
