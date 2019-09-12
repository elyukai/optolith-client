import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { filter, imap, List, minimumBy, notNull } from "../../Data/List";
import { ensure, maybe } from "../../Data/Maybe";
import { Compare, EQ, GT, LT } from "../../Data/Ord";
import { fst, Pair } from "../../Data/Tuple";
import { uncurryN } from "../../Data/Tuple/Curry";
import { SocialStatusId } from "../Constants/Ids";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { getLocaleAsProp, getSocialDependencies } from "./stateSelectors";

const getSocialStatusAssocs = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    imap (index => (name: string) => Pair (indexToSocialStatusId (index), name))
         (translate (l10n) ("socialstatuses"))
)

const compareSocialStatusId: Compare<SocialStatusId> =
  x => y => x > y ? GT : x < y ? LT : EQ

const gteSocialStatusId: (y: SocialStatusId) => (x: SocialStatusId) => boolean =
  y => x => x >= y

const getMinimumSocialStatus = createMaybeSelector (
  getSocialDependencies,
  pipe (
    ensure (notNull),
    fmap (minimumBy (compareSocialStatusId))
  )
)

const indexToSocialStatusId = (index: number) => index === 0
                                                 ? SocialStatusId.NotFree
                                                 : index === 1
                                                 ? SocialStatusId.Free
                                                 : index === 2
                                                 ? SocialStatusId.LesserNoble
                                                 : index === 3
                                                 ? SocialStatusId.Noble
                                                 : SocialStatusId.Aristocracy

export const getAvailableSocialStatuses = createMaybeSelector (
  getMinimumSocialStatus,
  getSocialStatusAssocs,
  uncurryN (maybe (ident as ident<List<Pair<SocialStatusId, string>>>)
                            ((min: SocialStatusId) => filter (pipe (fst, gteSocialStatusId (min)))))
)
