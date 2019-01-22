import { Either } from "../../../../../Data/Either";
import { append, empty, List, map, notNullStr } from "../../../../../Data/List";
import { ensure, fromMaybe, Maybe } from "../../../../../Data/Maybe";
import { fromList } from "../../../../../Data/OrderedMap";
import { fromBinary, Pair } from "../../../../../Data/Pair";
import { Advantage } from "../../../../Models/Wiki/Advantage";
import { toNatural } from "../../../NumberUtils";
import { mensureMapNaturalListOptional, mensureMapPairListOptional } from "../../validateMapValueUtils";
import { Expect, lookupKeyValid } from "../../validateValueUtils";

export const toPrerequisitesIndex =
  (lookup_l10n: (key: string) => Maybe<string>) =>
  (lookup_univ: (key: string) => Maybe<string>) =>{
    const checkOptionalUnivNaturalNumberList =
      lookupKeyValid (lookup_univ) (mensureMapNaturalListOptional ("&"))

    const eprerequisitesIndexUniv =
      checkOptionalUnivNaturalNumberList ("prerequisitesIndex")

    const eprerequisitesIndexL10n =
      lookupKeyValid (lookup_l10n)
                     (mensureMapPairListOptional ("&")
                                                      ("?")
                                                      (Expect.NaturalNumber)
                                                      (Expect.NonEmptyString)
                                                      (toNatural)
                                                      (ensure (notNullStr)))
                     ("prerequisitesIndex")

    return Either.liftM2<
        string,
        Maybe<List<number>>,
        Maybe<List<Pair<number, string>>>,
        Advantage["prerequisitesTextIndex"]
      >
        (prerequisitesIndexUniv => prerequisitesIndexL10n => {
          const univ = fromMaybe<List<number>> (empty)
                                               (prerequisitesIndexUniv)

          const l10n = fromMaybe<List<Pair<number, string>>> (empty)
                                                             (prerequisitesIndexL10n)

          return fromList (
            append<Pair<number, string | false>>
              (l10n)
              (map<number, Pair<number, string | false>>
                (i => fromBinary<number, false> (i, false))
                (univ))
          )
        })
        (eprerequisitesIndexUniv)
        (eprerequisitesIndexL10n)
  }
