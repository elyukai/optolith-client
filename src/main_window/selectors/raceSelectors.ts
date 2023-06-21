import { createSelector } from "@reduxjs/toolkit"
import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { selectRaceId, selectRaceVariantId } from "../slices/characterSlice.ts"
import { selectRaces } from "../slices/databaseSlice.ts"

export const selectCurrentRace = createSelector(
  selectRaces,
  selectRaceId,
  (races, id): Race | undefined => id === undefined ? undefined : races[id]
)

export const selectCurrentRaceVariant = createSelector(
  selectCurrentRace,
  selectRaceVariantId,
  (currentRace, id): RaceVariant | undefined =>
    id === undefined || currentRace?.variant_dependent.tag !== "HasVariants"
    ? undefined
    : currentRace.variant_dependent.has_variants.find(variant => variant.id === id)
)
