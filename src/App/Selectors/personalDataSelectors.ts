import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { elem, filter, imap, List, map, minimum, notNull, nub, subscript } from "../../Data/List";
import { alt, any, bind, ensure, Just, liftM2, mapMaybe, maybe } from "../../Data/Maybe";
import { dec } from "../../Data/Num";
import { fst, Pair, snd } from "../../Data/Tuple";
import { curryN, uncurryN, uncurryN3 } from "../../Data/Tuple/Curry";
import { DisadvantageId, SocialStatusId } from "../Constants/Ids";
import { DropdownOption } from "../Models/View/DropdownOption";
import { Culture } from "../Models/Wiki/Culture";
import { Race } from "../Models/Wiki/Race";
import { RaceVariant } from "../Models/Wiki/RaceVariant";
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { pipe, pipe_ } from "../Utilities/pipe";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { sortRecordsByName } from "../Utilities/sortBy";
import { getCulture, getRace, getRaceVariant } from "./rcpSelectors";
import { getDisadvantages, getLocaleAsProp, getSocialDependencies } from "./stateSelectors";

const CA = Culture.A

const getSocialStatusAssocs = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    imap (index => (name: string) => Pair (indexToSocialStatusId (index), name))
         (translate (l10n) ("socialstatuses"))
)

const getMinimumSocialStatus = createMaybeSelector (
  getSocialDependencies,
  pipe (
    ensure (notNull),
    fmap (minimum)
  )
)

const indexToSocialStatusId: (index: number) => SocialStatusId =
  i => {
    switch (i) {
      case 0: return SocialStatusId.NotFree
      case 2: return SocialStatusId.LesserNoble
      case 3: return SocialStatusId.Noble
      case 4: return SocialStatusId.Aristocracy
      default: return SocialStatusId.Free
    }
  }

const getAvailableSocialStatusesTuples = createMaybeSelector (
  getCulture,
  getMinimumSocialStatus,
  getSocialStatusAssocs,
  uncurryN3 (curryN (pipe (
    uncurryN (liftM2 (culture => min => filter <Pair<SocialStatusId, string>>
                                               (pipe (
                                                 fst,
                                                 id => id >= min
                                                       && elem (id) (CA.socialStatus (culture))
                                               )))),
    maybe (ident as ident<List<Pair<SocialStatusId, string>>>)
          <ident<List<Pair<SocialStatusId, string>>>>
          (ident)
  )))
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
                      (bind (mrace_variant) (RaceVariant.A.hairColors)))
  }
)

export const getAvailableHairColorOptions = createMaybeSelector (
  getLocaleAsProp,
  getAvailableHairColorIds,
  uncurryN (l10n => pipe (
                      mapMaybe (id => pipe_ (
                                        id,
                                        dec,
                                        subscript (translate (l10n) ("haircolors")),
                                        fmap (name => DropdownOption ({
                                                        id: Just (id),
                                                        name,
                                                      }))
                                      )),
                      sortRecordsByName (l10n)
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
                      (bind (mrace_variant) (RaceVariant.A.eyeColors)))
  }
)

export const getAvailableEyeColorOptions = createMaybeSelector (
  getLocaleAsProp,
  getAvailableEyeColorIds,
  uncurryN (l10n => pipe (
                      mapMaybe (id => pipe_ (
                                        id,
                                        dec,
                                        subscript (translate (l10n) ("eyecolors")),
                                        fmap (name => DropdownOption ({
                                                        id: Just (id),
                                                        name,
                                                      }))
                                      )),
                      sortRecordsByName (l10n)
                    ))
)
