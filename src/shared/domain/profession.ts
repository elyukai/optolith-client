import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import {
  Profession,
  ProfessionName,
  ProfessionPackage,
  ProfessionTranslation,
  ProfessionVariant,
  ProfessionVersion,
} from "optolith-database-schema/types/Profession"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { Nullish, isNotNullish } from "../utils/nullable.ts"
import { TranslateMap } from "../utils/translate.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"
import { ProfessionIdentifier } from "./identifier.ts"
import { Sex } from "./sex.ts"

export type ProfessionParts = {
  base: Profession
  translations: LocaleMap<ProfessionTranslation>
  instance: ProfessionVersion
  package: ProfessionPackage
}

export const getProfessionParts = (
  professions: Record<number, Profession>,
  id: number,
  instanceId: number,
  startExperienceLevel: ExperienceLevel,
): ProfessionParts | undefined => {
  const selectedProfession = professions[id]
  if (selectedProfession === undefined) {
    return undefined
  } else {
    const selectedInstance = selectedProfession.versions.find(x =>
      x.tag === "Experienced"
        ? x.experienced.id === instanceId
        : x.by_experience_level.id === instanceId,
    )

    if (selectedInstance === undefined) {
      return undefined
    } else {
      const selectedTranslations =
        selectedInstance.tag === "Experienced"
          ? selectedInstance.experienced.translations
          : selectedInstance?.by_experience_level.translations

      const selectedPackage =
        selectedInstance.tag === "Experienced"
          ? selectedInstance.experienced.package
          : selectedInstance.by_experience_level.packages_map.find(
              x => x.experience_level_id === startExperienceLevel.id,
            )?.package

      if (selectedPackage === undefined) {
        return undefined
      } else {
        return {
          base: selectedProfession,
          instance: selectedInstance,
          translations: selectedTranslations,
          package: selectedPackage,
        }
      }
    }
  }
}

export const getProfessionVariant = (
  profession: ProfessionParts,
  variantId?: number,
): ProfessionVariant | undefined => {
  if (variantId === undefined) {
    return undefined
  } else {
    return profession.package.variants?.list.find(x => x.id === variantId)
  }
}

export const professionNameToString = <T extends ProfessionName | undefined>(
  sex: Sex,
  professionName: T,
): string | Nullish<T> => {
  if (professionName === undefined || typeof professionName === "string") {
    return professionName as string | Nullish<T>
  } else {
    switch (sex.type) {
      case "Male":
        return professionName.male
      case "Female":
        return professionName.female
      case "BalThani":
      case "Tsajana":
      case "Custom":
        return professionName.default
      default:
        return assertExhaustive(sex)
    }
  }
}

export type FullProfessionNameParts = {
  name: string
  subName?: string
  variantName?: string
  fullName: string
}

export const getFullProfessionNameParts = (
  translateMap: TranslateMap,
  sex: Sex,
  profession: ProfessionParts,
  professionVariant?: ProfessionVariant,
  customName?: string,
): FullProfessionNameParts => {
  if (profession.base.id === ProfessionIdentifier.OwnProfession) {
    const name =
      customName ?? professionNameToString(sex, translateMap(profession.translations)?.name) ?? ""

    return {
      name,
      fullName: name,
    }
  }

  const professionName = professionNameToString(sex, translateMap(profession.translations)?.name)
  const professionSubName = professionNameToString(
    sex,
    translateMap(profession.translations)?.specification,
  )
  const professionVariantName = professionNameToString(
    sex,
    translateMap(professionVariant?.translations)?.name,
  )

  if (professionSubName !== undefined || professionVariantName !== undefined) {
    const specifications = [professionSubName, professionVariantName]
      .filter(isNotNullish)
      .join(", ")

    return {
      name: professionName ?? "",
      subName: professionSubName,
      variantName: professionVariantName,
      fullName: `${professionName ?? ""} (${specifications})`,
    }
  } else {
    return {
      name: professionName ?? "",
      fullName: professionName ?? "",
    }
  }
}
