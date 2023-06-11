import { createSelector } from "@reduxjs/toolkit"
import { Race } from "optolith-database-schema/types/Race"
import { selectRaceId } from "../slices/characterSlice.ts"
import { selectRaces } from "../slices/databaseSlice.ts"

export const selectCurrentRace = createSelector(
  selectRaces,
  selectRaceId,
  (races, id): Race | undefined => id === undefined ? undefined : races[id]
)
