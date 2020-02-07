import moment from "moment"
import { Either } from "../../../../../../Data/Either"
import { flip } from "../../../../../../Data/Function"
import { fmap } from "../../../../../../Data/Functor"
import { List, map, notNullStr } from "../../../../../../Data/List"
import { ensure, joinMaybeList, Maybe } from "../../../../../../Data/Maybe"
import { Record } from "../../../../../../Data/Record"
import { fst, snd } from "../../../../../../Data/Tuple"
import { Erratum } from "../../../../../Models/Wiki/sub/Errata"
import { pipe } from "../../../../pipe"
import { Expect } from "../../../Expect"
import { lookupKeyValid, TableType } from "../../Validators/Generic"
import { mensureMapPairListOptional } from "../../Validators/ToValue"

const isISODate = (x: string) => moment (x) .isValid ()

export const toErrata: (lookup_l10n: (key: string) => Maybe<string>) =>
                       Either<string, List<Record<Erratum>>> =
  flip (
         lookupKeyValid (
           pipe (
             mensureMapPairListOptional ("&")
                                        ("?")
                                        (Expect.Date)
                                        (Expect.NonEmptyString)
                                        (ensure (isISODate))
                                        (ensure (notNullStr)),
             fmap (pipe (
               joinMaybeList,
               map (p => Erratum ({ date: moment (fst (p)) .toDate (), description: snd (p) }))
             ))
           )
         )
         (TableType.L10n)
       )
       ("errata")
