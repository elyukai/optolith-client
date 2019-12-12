import { Either } from "../../../../../../Data/Either";
import { flip } from "../../../../../../Data/Function";
import { Cons, flength, List, splitOn } from "../../../../../../Data/List";
import { bindF, ensure, liftM2, listToMaybe, Maybe, maybe, Nothing } from "../../../../../../Data/Maybe";
import { Record } from "../../../../../../Data/Record";
import { Pair } from "../../../../../../Data/Tuple";
import { SourceLink } from "../../../../../Models/Wiki/sub/SourceLink";
import { toNatural } from "../../../../NumberUtils";
import { Expect } from "../../../Expect";
import { lookupKeyValid, TableType } from "../../Validators/Generic";
import { mensureMapList, mensureMapListOptional } from "../../Validators/ToValue";

const bookIdRx = /[A-Za-z0-9]+/u

const isBookIdString = (x: string) => bookIdRx .test (x)

const toSourceLink = (x: string) => {
  const xs = splitOn (",") (x) as Cons<string>

  if (![2, 3] .includes (flength (xs))) {
    return Nothing
  }

  const mid = ensure (isBookIdString) (xs .x)
  const pages = xs .xs as Cons<string>
  const mfirstPage = toNatural (pages .x)
  const mlastPage = bindF (toNatural)
                          (listToMaybe (pages .xs))

  return liftM2
    ((id: string) => (firstPage: number) =>
      SourceLink ({
        id,
        page: maybe<number | Pair<number, number>> (firstPage)
                    <number> (Pair (firstPage))
                    (mlastPage),
      }))
    (mid)
    (mfirstPage)
}

const expect_str = Expect.G (`BookId, ${Expect.NaturalNumber}, ${Expect.NaturalNumber}?`)

export const toSourceLinks: (lookup_l10n: (key: string) => Maybe<string>) =>
                            Either<string, List<Record<SourceLink>>> =
  flip (lookupKeyValid (mensureMapList ("&") (expect_str) (toSourceLink))
                       (TableType.L10n))
       ("src")

export const toSourceLinksOpt: (lookup_l10n: (key: string) => Maybe<string>) =>
                               Either<string, Maybe<List<Record<SourceLink>>>> =
  flip (lookupKeyValid (mensureMapListOptional ("&") (Expect.Maybe (expect_str)) (toSourceLink))
                       (TableType.L10n))
       ("src")
