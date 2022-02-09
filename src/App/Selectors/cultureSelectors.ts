import { fmap, fmapF } from "../../Data/Functor"
import { elemF, filter, List, map } from "../../Data/List"
import { bind, fromMaybe, mapMaybe } from "../../Data/Maybe"
import { elems, lookupF } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { Pair } from "../../Data/Tuple"
import { uncurryN, uncurryN3, uncurryN4 } from "../../Data/Tuple/Curry"
import { CultureCombined } from "../Models/View/CultureCombined"
import { Culture } from "../Models/Wiki/Culture"
import { Race } from "../Models/Wiki/Race"
import { RaceVariant } from "../Models/Wiki/RaceVariant"
import { Skill } from "../Models/Wiki/Skill"
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { getCurrentRaceVariant, getRace } from "./raceSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getCulturesCombinedSortOptions } from "./sortOptionsSelectors"
import { getCultureId, getCulturesFilterText, getCurrentCultureId, getWikiCultures, getWikiSkills } from "./stateSelectors"
import { getCulturesVisibilityFilter } from "./uisettingsSelectors"

const RA = Race.A
const RVA = RaceVariant.A
const CA = Culture.A
const CCA = CultureCombined.A
const ISA = IncreaseSkill.A

export const getCulture = createMaybeSelector (
  getWikiCultures,
  getCultureId,
  (cultures, cultureId) => bind (cultureId)
                                (lookupF (cultures))
)

export const getCurrentCulture = createMaybeSelector (
  getWikiCultures,
  getCurrentCultureId,
  (cultures, cultureId) => bind (cultureId)
                                (lookupF (cultures))
)

export const getAllCultures = createMaybeSelector (
  getWikiSkills,
  getWikiCultures,
  uncurryN (skills => pipe (
                        elems,
                        map (wiki_entry =>
                              CultureCombined ({
                                mappedCulturalPackageSkills:
                                  mapMaybe ((x: Record<IncreaseSkill>) => pipe_ (
                                             x,
                                             ISA.id,
                                             lookupF (skills),
                                             fmap ((skill: Record<Skill>) =>
                                               Pair (skill, ISA.value (x)))
                                           ))
                                           (CA.culturalPackageSkills (wiki_entry)),
                                wikiEntry: wiki_entry,
                              }))
                      ))
)

export const getCommonCultures = createMaybeSelector (
  getRace,
  getCurrentRaceVariant,
  (mrace, mrace_variant) => {
    const mrace_cultures = fmapF (mrace) (RA.commonCultures)

    const mrace_variant_cultures = fmapF (mrace_variant) (RVA.commonCultures)

    return List (
      ...fromMaybe (List<string> ()) (mrace_cultures),
      ...fromMaybe (List<string> ()) (mrace_variant_cultures)
    )
  }
)

export const getAvailableCultures = createMaybeSelector (
  getCommonCultures,
  getCulturesVisibilityFilter,
  getAllCultures,
  getRuleBooksEnabled,
  uncurryN4 (common_cultures =>
             visibility =>
             cs =>
             av =>
              visibility === "common"
                ? filterByAvailability (pipe (CCA.wikiEntry, CA.src))
                                       (av)
                                       (filter (pipe (
                                                 CCA.wikiEntry,
                                                 CA.id,
                                                 elemF (common_cultures)
                                               ))
                                               (cs))
                : filterByAvailability (pipe (CCA.wikiEntry, CA.src))
                                       (av)
                                       (cs))
)

export const getFilteredCultures = createMaybeSelector (
  getCulturesCombinedSortOptions,
  getCulturesFilterText,
  getAvailableCultures,
  uncurryN3 (filterAndSortRecordsBy (0) ([ pipe (CCA.wikiEntry, CA.name) ]))
)
