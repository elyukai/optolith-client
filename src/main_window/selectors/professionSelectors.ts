import { createSelector } from "@reduxjs/toolkit"
import { Profession, ProfessionPackage, ProfessionTranslation, ProfessionVariant, ProfessionVersion } from "optolith-database-schema/types/Profession"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { selectProfessionId, selectProfessionInstanceId, selectProfessionVariantId } from "../slices/characterSlice.ts"
import { selectProfessions } from "../slices/databaseSlice.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"

export type ProfessionAndInstance = {
  profession: Profession
  professionTranslations: LocaleMap<ProfessionTranslation>
  professionInstance: ProfessionVersion
  professionPackage: ProfessionPackage
}

export const selectCurrentProfession = createSelector(
  selectProfessions,
  selectProfessionId,
  selectProfessionInstanceId,
  selectStartExperienceLevel,
  (professions, id, instanceId, startExperienceLevel): ProfessionAndInstance | undefined => {
    if (id === undefined || instanceId === undefined || startExperienceLevel === undefined) {
      return undefined
    }
    else {
      const selectedProfession = professions[id]
      if (selectedProfession === undefined) {
        return undefined
      }
      else {
        const selectedInstance = selectedProfession.versions.find(x =>
          x.tag === "Experienced"
          ? x.experienced.id === instanceId
          : x.by_experience_level.id === instanceId)

        if (selectedInstance === undefined) {
          return undefined
        }
        else {
          const selectedTranslations = selectedInstance.tag === "Experienced"
            ? selectedInstance.experienced.translations
            : selectedInstance?.by_experience_level.translations

          const selectedPackage = selectedInstance.tag === "Experienced"
            ? selectedInstance.experienced.package
            : selectedInstance.by_experience_level.packages_map
                .find(x => x.experience_level_id === startExperienceLevel.id)?.package

          if (selectedPackage === undefined) {
            return undefined
          }
          else {
            return {
              profession: selectedProfession,
              professionInstance: selectedInstance,
              professionTranslations: selectedTranslations,
              professionPackage: selectedPackage,
            }
          }
        }
      }
    }
  }
)

export const selectCurrentProfessionVariant = createSelector(
  selectCurrentProfession,
  selectProfessionVariantId,
  (currentProfession, id): ProfessionVariant | undefined => {
    if (id === undefined || currentProfession === undefined) {
      return undefined
    }
    else {
      return currentProfession.professionPackage.variants?.list.find(x => x.id === id)
    }
  }
)
