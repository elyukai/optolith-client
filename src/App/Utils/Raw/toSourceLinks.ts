import { pipe } from "ramda";
import { Cons, fnull, map, splitOn } from "../../../Data/List";
import { any, fromJust, Just, Maybe } from "../../../Data/Maybe";
import { fromBinary } from "../../../Data/Pair";
import { SourceLink } from "../../Models/Wiki/sub/SourceLink";
import { unsafeToInt } from "../NumberUtils";
import { naturalNumber } from "../RegexUtils";
import { listRx } from "./csvRegexUtils";
import { lookupKeyValid, validateRawProp } from "./validateValueUtils";

const srcDel = ","

const src = `(?:[A-Za-z0-9]+)${srcDel}${naturalNumber.source}(?:${srcDel}${naturalNumber.source})?`

const srcListDel = "&"

const srcList = new RegExp (listRx (srcListDel) (src))

const checkSourceLinks =
  (x: string) => srcList .test (x)

export const lookupValidSourceLinks =
  (lookup_l10n: (key: string) => Maybe<string>) =>
    lookupKeyValid (lookup_l10n)
                   (validateRawProp ("List Natural")
                                    (any (checkSourceLinks)))
                   ("variants")

export const toSourceLinks =
  pipe (
    fromJust as (m: Just<string>) => string,
    splitOn (srcListDel),
    map (x => {
      const xs = splitOn (srcDel) (x) as Cons<string>
      const id = xs .x
      const pages = xs .xs as Cons<string>

      return SourceLink ({
        id,
        page: fnull (pages .xs)
          ? unsafeToInt (pages .x)
          : fromBinary (unsafeToInt (pages .x), unsafeToInt (pages .xs .x)),
      })
    })
  )
