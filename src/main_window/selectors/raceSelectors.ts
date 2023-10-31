import { createSelector } from "@reduxjs/toolkit"
import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { getRace, getRaceVariant } from "../../shared/domain/race.ts"
import { selectRaceId, selectRaceVariantId } from "../slices/characterSlice.ts"
import { selectStaticRaces } from "../slices/databaseSlice.ts"

/**
 * Select the current race of the character.
 */
export const selectCurrentRace = createSelector(
  selectStaticRaces,
  selectRaceId,
  (races, id): Race | undefined => (id === undefined ? undefined : getRace(races, id)),
)

/**
 * Select the current race variant of the character, if any.
 */
export const selectCurrentRaceVariant = createSelector(
  selectCurrentRace,
  selectRaceVariantId,
  (currentRace, id): RaceVariant | undefined =>
    currentRace === undefined ? undefined : getRaceVariant(currentRace, id),
)
