import { fmap } from "../../Data/Functor"
import { bind } from "../../Data/Maybe"
import { lookupF } from "../../Data/OrderedMap"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { getExperienceLevelIdByAp } from "../Utilities/ELUtils"
import { pipe } from "../Utilities/pipe"
import { getExperienceLevelStartId, getTotalAdventurePoints, getWikiExperienceLevels } from "./stateSelectors"

export const getCurrentEl = createMaybeSelector (
  getWikiExperienceLevels,
  getTotalAdventurePoints,
  (all_els, mtotal_ap) => bind (mtotal_ap)
                               (pipe (getExperienceLevelIdByAp (all_els), lookupF (all_els)))
)

export const getStartEl = createMaybeSelector (
  getWikiExperienceLevels,
  getExperienceLevelStartId,
  (all_els, mid) => bind (mid) (lookupF (all_els))
)

export const getMaxTotalAttributeValues = createMaybeSelector (
  getStartEl,
  fmap (ExperienceLevel.A.maxTotalAttributeValues)
)
