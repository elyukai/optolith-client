import { Either } from "../../../../../../Data/Either";
import { flip } from "../../../../../../Data/Function";
import { fmap } from "../../../../../../Data/Functor";
import { List, map, notNullStr } from "../../../../../../Data/List";
import { ensure, joinMaybeList, Maybe } from "../../../../../../Data/Maybe";
import { Record } from "../../../../../../Data/Record";
import { fst, snd } from "../../../../../../Data/Tuple";
import { Erratum } from "../../../../../Models/Wiki/sub/Errata";
import { pipe } from "../../../../pipe";
import { Expect } from "../../../Expect";
import { lookupKeyValid, TableType } from "../../Validators/Generic";
import { mensureMapPairListOptional } from "../../Validators/ToValue";

const isISODate =
  (x: string) => /[1-9]\d{3}-(?:0[1-9]|1[0-2])-\d(?:0[1-9]|[12][0-9]|3[01])/u .test (x)

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
               map (p => Erratum ({ date: new Date (fst (p)), description: snd (p) }))
             ))
           )
         )
         (TableType.L10n)
       )
       ("errata")
