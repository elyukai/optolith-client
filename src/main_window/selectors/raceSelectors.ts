import { createSelector } from "@reduxjs/toolkit"
import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { getRace, getRaceVariant } from "../../shared/domain/race.ts"
import { selectRaceId, selectRaceVariantId } from "../slices/characterSlice.ts"
import { selectRaces } from "../slices/databaseSlice.ts"

export const selectCurrentRace = createSelector(
  selectRaces,
  selectRaceId,
  (races, id): Race | undefined => id === undefined ? undefined : getRace(races, id)
)

export const selectCurrentRaceVariant = createSelector(
  selectCurrentRace,
  selectRaceVariantId,
  (currentRace, id): RaceVariant | undefined =>
    currentRace === undefined ? undefined : getRaceVariant(currentRace, id)
)
