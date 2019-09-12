import { drop, imap, minimum } from "../../Data/List";
import { Pair } from "../../Data/Tuple";
import { uncurryN } from "../../Data/Tuple/Curry";
import { SocialStatusId } from "../Constants/Ids";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { pipe_ } from "../Utilities/pipe";
import { getLocaleAsProp, getSocialDependencies } from "./stateSelectors";

export const getAllPets = createMaybeSelector (
  getMinimumSocialStatus,
  getSocialStatusAssocs,
  uncurryN (l10n =>
             min =>
               pipe_ (
                 translate (l10n) ("socialstatuses"),
                 drop (min - 1),

               ))
)

const getMinimumSocialStatus = createMaybeSelector (
  getSocialDependencies,
  minimum
)

const getSocialStatusAssocs = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    imap (index => (name: string) => Pair (indexToSocialStatusId (index), name))
         (translate (l10n) ("socialstatuses"))
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
