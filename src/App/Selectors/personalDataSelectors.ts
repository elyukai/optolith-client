import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { elem, filter, imap, List, map, minimum, notNull } from "../../Data/List";
import { ensure, Just, liftM2, maybe } from "../../Data/Maybe";
import { fst, Pair, snd } from "../../Data/Tuple";
import { curryN, uncurryN, uncurryN3 } from "../../Data/Tuple/Curry";
import { SocialStatusId } from "../Constants/Ids";
import { Culture } from "../Models/Wiki/Culture";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { DropdownOption } from "../Views/Universal/Dropdown";
import { getCulture } from "./rcpSelectors";
import { getLocaleAsProp, getSocialDependencies } from "./stateSelectors";

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
