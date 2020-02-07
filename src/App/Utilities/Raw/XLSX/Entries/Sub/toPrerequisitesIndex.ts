import { Either } from "../../../../../../Data/Either"
import { append, empty, List, map, notNullStr } from "../../../../../../Data/List"
import { ensure, fromMaybe, Maybe } from "../../../../../../Data/Maybe"
import { fromList } from "../../../../../../Data/OrderedMap"
import { Pair } from "../../../../../../Data/Tuple"
import { Advantage } from "../../../../../Models/Wiki/Advantage"
import { toNatural } from "../../../../NumberUtils"
import { Expect } from "../../../Expect"
import { lookupKeyValid, TableType } from "../../Validators/Generic"
import { mensureMapNaturalListOptional, mensureMapPairListOptional } from "../../Validators/ToValue"

export const toPrerequisitesIndex =
  (lookup_l10n: (key: string) => Maybe<string>) =>
  (lookup_univ: (key: string) => Maybe<string>) => {
    const checkOptionalUnivNaturalNumberList =
      lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

    const eprerequisitesIndexUniv =
      checkOptionalUnivNaturalNumberList ("prerequisitesIndex")

    const eprerequisitesIndexL10n =
      lookupKeyValid (mensureMapPairListOptional ("&")
                                                      ("?")
                                                      (Expect.NaturalNumber)
                                                      (Expect.NonEmptyString)
                                                      (toNatural)
                                                      (ensure (notNullStr)))
                     (TableType.L10n)
                     (lookup_l10n)
                     ("prerequisitesIndex")

    return Either.liftM2<
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
                (i => Pair<number, false> (i, false))
                (univ))
          )
        })
        (eprerequisitesIndexUniv)
        (eprerequisitesIndexL10n)
  }
