import { Either } from "../../../../../Data/Either";
import { flip } from "../../../../../Data/Function";
import { Cons, flength, List, splitOn } from "../../../../../Data/List";
import { bindF, ensure, liftM2, listToMaybe, Maybe, maybe, Nothing } from "../../../../../Data/Maybe";
import { Pair } from "../../../../../Data/Pair";
import { Record } from "../../../../../Data/Record";
import { SourceLink } from "../../../../Models/Wiki/sub/SourceLink";
import { toNatural } from "../../../NumberUtils";
import { Expect } from "../../showExpected";
import { mensureMapListOptional } from "../../validateMapValueUtils";
import { lookupKeyValid, TableType } from "../../validateValueUtils";

const bookIdRx = /[A-Za-z0-9]+/

const isBookIdString = (x: string) => bookIdRx .test (x)

export const toSourceLinks =
  flip (
         lookupKeyValid (
           mensureMapListOptional ("&")
                                  (
                                    `BookId, `
                                    + `${Expect.NaturalNumber}, `
                                    + `${Expect.NaturalNumber}?`
                                  )
                                  (x => {
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
                                  })
         )
         (TableType.L10n)
       )
       ("variants") as
         (lookup_l10n: (key: string) => Maybe<string>) => Either<string, List<Record<SourceLink>>>
