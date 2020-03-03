import { notNull } from "../../Data/List"
import { maybe } from "../../Data/Maybe"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { getCurrentHeroFuture, getCurrentHeroPast } from "./stateSelectors"

const getStateHistoryAvailability = maybe (false) (notNull)

export const getUndoAvailability = createMaybeSelector (
  getCurrentHeroPast,
  getStateHistoryAvailability
)

export const getRedoAvailability = createMaybeSelector (
  getCurrentHeroFuture,
  getStateHistoryAvailability
)
