import { equals } from "../../Data/Eq"
import { fmap, fmapF } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { consF, intercalate, List, map } from "../../Data/List"
import { alt, any, bind, liftM2, mapMaybe, maybe } from "../../Data/Maybe"
import { abs } from "../../Data/Num"
import { elems, lookupF } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { uncurryN, uncurryN3 } from "../../Data/Tuple/Curry"
import { traceShowId } from "../../Debug/Trace"
import { RaceId } from "../Constants/Ids"
import { RaceCombined } from "../Models/View/RaceCombined"
import { Culture } from "../Models/Wiki/Culture"
import { Race, RaceL } from "../Models/Wiki/Race"
import { RaceVariant, RaceVariantL } from "../Models/Wiki/RaceVariant"
import { Die } from "../Models/Wiki/sub/Die"
import { minus, plusmn } from "../Utilities/Chars"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { translate } from "../Utilities/I18n"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getRacesCombinedSortOptions } from "./sortOptionsSelectors"
import { getCurrentRaceId, getCurrentRaceVariantId, getRaceId, getRacesFilterText, getRaceVariantId, getWiki, getWikiCultures, getWikiRaces, getWikiRaceVariants } from "./stateSelectors"

const RA = Race.A
const RL = RaceL
const RVA = RaceVariant.A
const RVL = RaceVariantL
const RCA = RaceCombined.A
const CA = Culture.A

export const getRace = createMaybeSelector (
  getWikiRaces,
  getRaceId,
  (races, raceId) => bind (raceId)
                          (lookupF (races))
)

export const getCurrentRace = createMaybeSelector (
  getWikiRaces,
  getCurrentRaceId,
  (races, raceId) => bind (raceId)
                          (lookupF (races))
)

export const getRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getRaceVariantId,
  (raceVariants, raceVariantId) => bind (raceVariantId)
                                        (lookupF (raceVariants))
)

export const getCurrentRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getCurrentRaceVariantId,
  (raceVariants, raceVariantId) => bind (raceVariantId)
                                        (lookupF (raceVariants))
)

export const getAllRaces = createMaybeSelector (
  getWikiCultures,
  getWikiRaceVariants,
  getWikiRaces,
  uncurryN3 (cultures =>
             race_variants => {
               const getAvailableCulturesNames =
                 mapMaybe (pipe (lookupF (cultures), fmap (CA.name)))

               return pipe (
                 elems,
                 traceShowId,
                 map (race =>
                       RaceCombined ({
                         mappedVariants:
                           mapMaybe (pipe (
                                      lookupF (race_variants),
                                      fmap (over (RVL.commonCultures)
                                                 (getAvailableCulturesNames))
                                    ))
                                    (RA.variants (race)),
                         wikiEntry: over (RL.commonCultures)
                                         (getAvailableCulturesNames)
                                         (race),
                       }))
               )
             })
)

export const getAvailableRaces = createMaybeSelector (
  getRuleBooksEnabled,
  getAllRaces,
  uncurryN (filterByAvailability (pipe (RCA.wikiEntry, RA.src)))
)

export const getFilteredRaces = createMaybeSelector (
  getRacesCombinedSortOptions,
  getRacesFilterText,
  getAvailableRaces,
  uncurryN3 (filterAndSortRecordsBy (0) ([ pipe (RCA.wikiEntry, RA.name) ]))
)

export const getAutomaticAdvantages = createMaybeSelector (
  getRace,
  maybe (List<string> ()) (RA.automaticAdvantages)
)

const getSign = (x: number) => x < 0 ? minus : "+"

export const getRandomSizeCalcStr = createMaybeSelector (
  getWiki,
  getRace,
  getCurrentRaceVariant,
  (staticData, mrace, mrace_var) => {
    const msize_base = alt (bind (mrace) (RA.sizeBase))
                           (fmapF (mrace_var) (RVA.sizeBase))

    const msize_randoms = alt (bind (mrace) (RA.sizeRandom))
                              (fmapF (mrace_var) (RVA.sizeRandom))

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const dice_tag = translate (staticData) ("general.dice")

                    return pipe_ (
                      randoms,
                      map (die => {
                        const sides = Die.A.sides (die)
                        const amount = Die.A.amount (die)
                        const sign = getSign (sides)

                        return `${sign} ${amount}${dice_tag}${abs (sides)}`
                      }),
                      consF (`${base}`),
                      intercalate (" ")
                    )
                  })
                  (msize_base)
                  (msize_randoms)
  }
)

export const getRandomWeightCalcStr = createMaybeSelector (
  getWiki,
  getRace,
  (staticData, mrace) => {
    const mweight_base = fmap (RA.weightBase) (mrace)
    const mweight_randoms = fmap (RA.weightRandom) (mrace)
    const is_humans = any (pipe (RA.id, equals<string> (RaceId.Humans))) (mrace)

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const size_tag = translate (staticData) ("personaldata.size")
                    const dice_tag = translate (staticData) ("general.dice")

                    return pipe_ (
                      randoms,
                      map (die => {
                        const sides = Die.A.sides (die)
                        const amount = Die.A.amount (die)
                        const sign = is_humans ? plusmn : getSign (sides)

                        return `${sign} ${amount}${dice_tag}${abs (sides)}`
                      }),
                      consF (`${minus} ${base}`),
                      consF (size_tag),
                      intercalate (" ")
                    )
                  })
                  (mweight_base)
                  (mweight_randoms)
  }
)
