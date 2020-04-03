import { fmap, fmapF } from "../../Data/Functor"
import { consF, elem, elemF, List, map, minimum, notNull, nub } from "../../Data/List"
import { alt, any, bind, ensure, fromJust, isJust, Just, mapMaybe, maybe } from "../../Data/Maybe"
import { gte } from "../../Data/Num"
import { foldr, lookupF } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { filterMapListT, filterT, idT, Transducer } from "../../Data/Transducer"
import { fst, Pair, snd } from "../../Data/Tuple"
import { uncurryN } from "../../Data/Tuple/Curry"
import { DisadvantageId, SocialStatusId } from "../Constants/Ids"
import { NumIdName } from "../Models/NumIdName"
import { DropdownOption } from "../Models/View/DropdownOption"
import { Culture } from "../Models/Wiki/Culture"
import { Race } from "../Models/Wiki/Race"
import { RaceVariant } from "../Models/Wiki/RaceVariant"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils"
import { composeT } from "../Utilities/compose"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe, pipe_ } from "../Utilities/pipe"
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils"
import { sortRecordsByName } from "../Utilities/sortBy"
import { getCulture } from "./cultureSelectors"
import { getRace, getRaceVariant } from "./raceSelectors"
import { getDisadvantages, getSocialDependencies, getWiki } from "./stateSelectors"

const CA = Culture.A

const getSocialStatusAssocs = createMaybeSelector (
  getWiki,
  pipe (
    StaticData.A.socialStatuses,
    foldr ((x: Record<NumIdName>) => consF (Pair (NumIdName.A.id (x), NumIdName.A.name (x))))
          (List ())
  )
)

const getMinimumSocialStatus = createMaybeSelector (
  getSocialDependencies,
  pipe (
    ensure (notNull),
    fmap (minimum)
  )
)

type Social = Pair<SocialStatusId, string>

const getAvailableSocialStatusesTuples = createMaybeSelector (
  getCulture,
  getMinimumSocialStatus,
  getSocialStatusAssocs,
  (mculture, mmin, xs): List<Social> =>
    filterMapListT (composeT (
      isJust (mculture)
        ? filterT<Social> (pipe (fst, elemF (CA.socialStatus (fromJust (mculture)))))
        : idT as Transducer<Social, Social>,
      isJust (mmin)
        ? filterT<Social> (pipe (fst, gte (fromJust (mmin))))
        : idT
    ))
    (xs)
)

export const getAvailableSocialStatuses = createMaybeSelector (
  getAvailableSocialStatusesTuples,
  map ((t: Pair<SocialStatusId, string>) => DropdownOption ({
    id: Just (fst (t)),
    name: snd (t),
  }))
)

export const getAvailableHairColorIds = createMaybeSelector (
  getRace,
  getRaceVariant,
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.Stigma),
  (mrace, mrace_variant, mstigma): List<number> => {
    const mstigma_active = fmap (getActiveSelections) (mstigma)
    const is_albino = any (elem<string | number> (1)) (mstigma_active)
    const is_green_haired = any (elem<string | number> (3)) (mstigma_active)

    if (is_albino && is_green_haired) {
      return List (24, 25)
    }

    if (is_albino) {
      return List (24)
    }

    if (is_green_haired) {
      return List (25)
    }

    return maybe (List<number> ())
                 <List<number>> (nub)
                 (alt (bind (mrace) (Race.A.hairColors))
                      (fmapF (mrace_variant) (RaceVariant.A.hairColors)))
  }
)

export const getAvailableHairColorOptions = createMaybeSelector (
  getWiki,
  getAvailableHairColorIds,
  uncurryN (staticData => pipe (
                            mapMaybe (id => pipe_ (
                                              id,
                                              lookupF (StaticData.A.hairColors (staticData)),
                                              fmap (pipe (
                                                NumIdName.A.name,
                                                name => DropdownOption ({
                                                          id: Just (id),
                                                          name,
                                                        })
                                              ))
                                            )),
                            sortRecordsByName (staticData)
                          ))
)

export const getAvailableEyeColorIds = createMaybeSelector (
  getRace,
  getRaceVariant,
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.Stigma),
  (mrace, mrace_variant, mstigma): List<number> => {
    const mstigma_active = fmap (getActiveSelections) (mstigma)
    const is_albino = any (elem<string | number> (1)) (mstigma_active)

    if (is_albino) {
      return List (19, 20)
    }

    return maybe (List<number> ())
                 <List<number>> (nub)
                 (alt (bind (mrace) (Race.A.eyeColors))
                      (fmapF (mrace_variant) (RaceVariant.A.eyeColors)))
  }
)

export const getAvailableEyeColorOptions = createMaybeSelector (
  getWiki,
  getAvailableEyeColorIds,
  uncurryN (staticData => pipe (
                            mapMaybe (id => pipe_ (
                                              id,
                                              lookupF (StaticData.A.eyeColors (staticData)),
                                              fmap (pipe (
                                                NumIdName.A.name,
                                                name => DropdownOption ({
                                                          id: Just (id),
                                                          name,
                                                        })
                                              ))
                                            )),
                            sortRecordsByName (staticData)
                          ))
)
