import { Either } from "../../../../../../Data/Either"
import { flip } from "../../../../../../Data/Function"
import { List, splitOn } from "../../../../../../Data/List"
import { Just, mapM, Maybe } from "../../../../../../Data/Maybe"
import { toNatural, unsafeToInt } from "../../../../NumberUtils"
import { isNaturalNumber } from "../../../../RegexUtils"
import { Expect } from "../../../Expect"
import { lookupKeyValid, TableType } from "../../Validators/Generic"
import { bindOptional, mensureMap } from "../../Validators/ToValue"

export const toActivatableCost =
  flip (lookupKeyValid (mensureMap (Expect.Maybe (Expect.G (
                                     Expect.Union (
                                       Expect.NaturalNumber,
                                       Expect.List (Expect.NaturalNumber)
                                     )
                                   )))
                                   (bindOptional<number | List<number>> (
                                     x => isNaturalNumber (x)
                                       ? Just (unsafeToInt (x))
                                       : mapM<string, number> (toNatural) (splitOn ("&") (x))
                                   )))
                       (TableType.Univ))
       ("cost") as
         (lookup_univ: (key: string) => Maybe<string>) =>
           Either<string, Maybe<number | List<number>>>
