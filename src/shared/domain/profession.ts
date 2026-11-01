import { type Nullish, isNotNullish } from "@elyukai/utils/nullable"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Profession as RawProfession } from "@optolith/character-schema/types"
import type {
  Profession,
  Profession_ID,
  ProfessionName,
  ProfessionPackage,
  ProfessionPackage_ID,
  ProfessionVariant,
  ProfessionVariant_ID,
  ProfessionVersion,
  ProfessionVersion_ID,
} from "@optolith/database-schema/gen"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { action, computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { Character } from "./character.ts"
import type { Sex } from "./sex.ts"

export class CharacterProfession {
  readonly global: Global
  readonly character: Character

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
    character: Character,
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

  static fromJSON(global: Global, character: Character, raw: RawProfession): CharacterProfession {
    return new CharacterProfession(global, character, raw.package, raw.variant, raw.customName)
  }

  toJSON(): RawProfession | undefined {
    if (this.baseId === undefined || this.versionId === undefined) {
      return undefined
    }
    return {
      base: this.baseId,
      version: this.versionId,
      package: this.packageId,
      variant: this.variantId,
      customName: this.customName,
    }
  }
}

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
