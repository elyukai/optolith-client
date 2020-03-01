import { flip, ident, on } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { range } from "../../Data/Ix"
import { consF, foldr, intercalate, List, map, notNull, reverse, setAt, sortBy } from "../../Data/List"
import { ensure, listToMaybe, mapMaybe, maybe, maybe_ } from "../../Data/Maybe"
import { compare } from "../../Data/Num"
import { adjust, adjustDef, foldrWithKey, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { empty, insert, OrderedSet, sdelete, toList } from "../../Data/OrderedSet"
import { Record } from "../../Data/Record"
import { fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { upd2 } from "../../Data/Tuple/Update"
import { Book } from "../Models/Wiki/Book"
import { SourceLink } from "../Models/Wiki/sub/SourceLink"
import { SourceLinks } from "../Models/Wiki/sub/SourceLinks"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { ndash } from "./Chars"
import { compareLocale } from "./I18n"
import { pipe, pipe_ } from "./pipe"
import { isNumber } from "./typeCheckUtils"

const SDA = StaticData.A
const BA = Book.A
const SLA = SourceLink.A
const SLsA = SourceLinks.A

type Page = number | Pair<number, number>

const unfoldSources =
  flip (foldr ((x: Record<SourceLink>) => {
                const page = SLA.page (x)

                return adjustDef (empty as OrderedSet<number>)
                                 (isTuple (page)
                                   ? flip (foldr (insert)) (range (page))
                                   : insert (page))
                                 (SLA.id (x))
              }))

/**
 * `groupSortInt :: [Int] -> [Int | (Int, Int)]`
 *
 * Combines adjacent integers into a pair. Leaves the other ints as they are.
 * The result is sorted in ascending order.
 *
 * ```haskell
 * groupSortInt [1, 3, 12, 4, 7, 5, 9, 10] == [1, (3, 5), 7, (9, 10), 12]
 * ```
 */
export const groupSortInt =
  pipe (
    sortBy (flip (compare)),
    foldr ((x: number) => (xs: List<Page>) =>
            maybe_ (() => List<Page> (x))
                   ((prev: Page) =>
                     isNumber (prev)
                       ? x === prev + 1
                         ? setAt (0) <Page> (Pair (prev, x)) (xs)
                         : consF <Page> (x) (xs)
                       : x === snd (prev) + 1
                         ? setAt (0) <Page> (upd2 (x) (prev)) (xs)
                         : consF <Page> (x) (xs))
                   (listToMaybe (xs)))
          (List ()),
    reverse
  )

export const mergeSources: (xss: List<List<Record<SourceLink>>>) => List<Record<SourceLinks>> =
  pipe (
    foldr (unfoldSources) (OrderedMap.empty),
    foldrWithKey ((k: string) => (x: OrderedSet<number>) =>
                   consF (SourceLinks ({
                           id: k,
                           pages: pipe_ (
                             x,
                             toList,
                             groupSortInt
                           ),
                         })))
                 (List ())
  )

const showPages =
  pipe (
    map ((x: Page) => isNumber (x) ? `${x}` : `${fst (x)}${ndash}${snd (x)}`),
    intercalate (", ")
  )

export const showSources =
  (staticData: StaticDataRecord): (xs: List<Record<SourceLinks>>) => string =>
    pipe (
      mapMaybe (x => pipe_ (
                 x,
                 SLsA.id,
                 lookupF (SDA.books (staticData)),
                 fmap (pipe (BA.name, name => Pair (name, showPages (SLsA.pages (x)))))
               )),
      sortBy (on (compareLocale (staticData)) (fst)),
      map (x => `${fst (x)} ${snd (x)}`),
      intercalate ("; ")
    )

export const combineShowSources =
  (staticData: StaticDataRecord) =>
    pipe (
      mergeSources,
      showSources (staticData)
    )

export const mergeSourcesWithout:
  (excludes: List<List<Record<SourceLink>>>) =>
  (xss: List<List<Record<SourceLink>>>) => List<Record<SourceLinks>> =
  excludes =>
    pipe (
      foldr (unfoldSources) (OrderedMap.empty),
      flip (foldrWithKey ((k: string) => (x: OrderedSet<number>) =>
                           adjust (flip (foldr (sdelete)) (toList (x))) (k)))
           (foldr (unfoldSources) (OrderedMap.empty) (excludes)),
      foldrWithKey ((k: string) => (x: OrderedSet<number>) =>
                     pipe_ (
                       x,
                       toList,
                       groupSortInt,
                       ensure (notNull),
                       maybe (ident as ident<List<Record<SourceLinks>>>)
                             (pages => consF (SourceLinks ({
                                               id: k,
                                               pages,
                                             })))
                     ))
                  (List ())
    )

export const combineShowSourcesWithout =
  (staticData: StaticDataRecord) =>
  (without: List<List<Record<SourceLink>>>) =>
    pipe (
      mergeSourcesWithout (without),
      showSources (staticData)
    )
