import { List, splitOn } from "../../../../../Data/List";
import { Just, mapM, Maybe } from "../../../../../Data/Maybe";
import { toNatural, unsafeToInt } from "../../../NumberUtils";
import { isNaturalNumber } from "../../../RegexUtils";
import { bindOptional, mensureMap } from "../../validateMapValueUtils";
import { Expect, lookupKeyValid } from "../../validateValueUtils";

export const toActivatableCost =
  (lookup_univ: (key: string) => Maybe<string>) =>
    lookupKeyValid (lookup_univ)
                   (mensureMap
                     (Expect.Maybe (Expect.G (
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
                   ("cost")
