import { pipe } from "ramda";
import { Either } from "../../../../../Data/Either";
import { append, Cons, empty, length, List, map, notNullStr, splitOn } from "../../../../../Data/List";
import { fromMaybe, Just, mapM, Maybe, Nothing } from "../../../../../Data/Maybe";
import { fromList } from "../../../../../Data/OrderedMap";
import { fromBinary, Pair } from "../../../../../Data/Pair";
import { Advantage } from "../../../../Models/Wiki/Advantage";
import { unsafeToInt } from "../../../NumberUtils";
import { isNaturalNumber } from "../../../RegexUtils";
import { optionalMap, validateMapOptionalNaturalNumberListProp, validateMapRawProp } from "../../validateMapValueUtils";
import { Expect, lookupKeyValid } from "../../validateValueUtils";

const toPrerequisitesIndexL10n =
  pipe (
    splitOn ("&"),
    mapM<string, Pair<number, string>> (
      e => {
        const xs = splitOn ("?") (e)

        if (length (xs) === 2) {
          const index = (xs as Cons<string>) .x
          const replacement = ((xs as Cons<string>) .xs as Cons<string>) .x

          if (isNaturalNumber (index) && notNullStr (replacement)) {
            return Just (fromBinary (unsafeToInt (index), replacement))
          }

          return Nothing // Left ("Invalid prerequisite index element types.")
        }

        return Nothing // Left ("Invalid prerequisite index element list length.")
      }
    )
  )

export const toPrerequisitesIndex =
  (lookup_l10n: (key: string) => Maybe<string>) =>
  (lookup_univ: (key: string) => Maybe<string>) =>{
    const checkOptionalUnivNaturalNumberList =
      lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberListProp ("&"))

    const eprerequisitesIndexUniv =
      checkOptionalUnivNaturalNumberList ("prerequisitesIndex")

    const eprerequisitesIndexL10n =
      lookupKeyValid (lookup_l10n)
                     (validateMapRawProp (Expect.Maybe (
                                           Expect.List (
                                             Expect.Pair (Expect.NaturalNumber)
                                                         (Expect.NonEmptyString)
                                           )
                                         ))
                                         (optionalMap (toPrerequisitesIndexL10n)))
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
