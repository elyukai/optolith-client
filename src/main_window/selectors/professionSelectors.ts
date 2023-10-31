import { createSelector } from "@reduxjs/toolkit"
import { ProfessionVariant } from "optolith-database-schema/types/Profession"
import {
  ProfessionParts,
  getProfessionParts,
  getProfessionVariant,
} from "../../shared/domain/profession.ts"
import {
  selectProfessionId,
  selectProfessionInstanceId,
  selectProfessionVariantId,
} from "../slices/characterSlice.ts"
import { selectStaticProfessions } from "../slices/databaseSlice.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"

/**
 * Returns different selected parts of a base profession.
 */
export const selectCurrentProfession = createSelector(
  selectStaticProfessions,
  selectProfessionId,
  selectProfessionInstanceId,
  selectStartExperienceLevel,
  (professions, id, instanceId, startExperienceLevel): ProfessionParts | undefined => {
    if (id === undefined || instanceId === undefined || startExperienceLevel === undefined) {
      return undefined
    } else {
      return getProfessionParts(professions, id, instanceId, startExperienceLevel)
    }
  },
)

/**
 * Returns the current profession variant.
 */
export const selectCurrentProfessionVariant = createSelector(
  selectCurrentProfession,
  selectProfessionVariantId,
  (currentProfession, id): ProfessionVariant | undefined => {
    if (id === undefined || currentProfession === undefined) {
      return undefined
    } else {
      return getProfessionVariant(currentProfession, id)
    }
  },
)
