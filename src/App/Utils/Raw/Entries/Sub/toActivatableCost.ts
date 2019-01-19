import { List, splitOn } from "../../../../../Data/List";
import { Just, mapM, Maybe } from "../../../../../Data/Maybe";
import { toNatural, unsafeToInt } from "../../../NumberUtils";
import { isNaturalNumber } from "../../../RegexUtils";
import { optionalMap, validateMapRawProp } from "../../validateMapValueUtils";
import { Expect, lookupKeyValid } from "../../validateValueUtils";

export const toActivatableCost =
  (lookup_univ: (key: string) => Maybe<string>) =>
    lookupKeyValid (lookup_univ)
                   (validateMapRawProp
                     (Expect.Maybe (Expect.G (
                       Expect.Union (
                         Expect.NaturalNumber,
                         Expect.List (Expect.NaturalNumber)
                       )
                     )))
                     (optionalMap<number | List<number>> (
                       x => isNaturalNumber (x)
                         ? Just (unsafeToInt (x))
                         : mapM<string, number> (toNatural) (splitOn ("&") (x))
                     )))
                   ("cost")
