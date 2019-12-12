import { bind, bindF, Either, isRight, liftM2, mapM } from "../../../../Data/Either";
import { fmap, fmapF } from "../../../../Data/Functor";
import { append, deleteAtPair, findIndex, List, map, mapAccumL } from "../../../../Data/List";
import { catMaybes, elem, fromJust, isNothing, Maybe, maybe } from "../../../../Data/Maybe";
import { fromList, lookup, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { fst, Pair, snd, uncurry } from "../../../../Data/Tuple";
import { traceShowIdWhen } from "../../../../Debug/Trace";
import { ReduxAction } from "../../../Actions/Actions";
import { setLoadingPhase } from "../../../Actions/IOActions";
import { Book } from "../../../Models/Wiki/Book";
import { pipe, pipe_ } from "../../pipe";
import { Row, Sheet } from "./CSVtoList";
import { BothOptionalRows } from "./MergeRows";

interface RecordWithId extends RecordIBase<any> {
  id: string
}

/**
 * `listToMapById :: RecordWithId a => [a] -> Map String a`
 *
 * Converts a list of Records with an `id` prop to a Map, where the keys are the
 * IDs and the values are the corresponding Records.
 */
const listToMapById =
  pipe (map ((x: Record<RecordWithId>) => Pair (Book.AL.id (x), x)), fromList) as
    <A extends RecordWithId> (x0: List<Record<A>>) => OrderedMap<string, Record<A>>

/**
 * `type JoinL10nRow :: Map String String -> Either String a`
 *
 * A converting function that takes a row from the current L10n sheet and
 * converts into a `Right` Record. In case of any error, a `Left` is returned,
 * containing the error message.
 */
type JoinL10nRow<A> =
  (l10n_row: OrderedMap<string, string>) => Either<string, A>

/**
 * `type JoinUnivRow :: Map String String -> Either String a`
 *
 * A converting function that takes a row from the current L10n sheet and
 * converts into a `Right` Record. In case of any error, a `Left` is returned,
 * containing the error message.
 */
type JoinUnivRow<A> =
  (univ_row: OrderedMap<string, string>) => Either<string, A>

/**
 * `type JoinUnivRowWithMatching :: [Map String String] -> Map String String -> Either String a`
 *
 * A converting function that takes a row from the current universal sheet and
 * all rows from the corresponding L10n sheet and converts into a `Right`
 * Record. In case of any error, a `Left` is returned, containing the error
 * message.
 */
type JoinUnivRowWithMatchingL10n<A> =
  (l10n: Sheet) =>
  (univ_row: OrderedMap<string, string>) => Either<string, Maybe<A>>

/**
 * `type JoinUnivRowWithMatching :: [Map String String] -> Map String String -> Either String a`
 *
 * A converting function that takes a row from the current universal sheet and
 * all rows from the corresponding L10n sheet and converts into a `Right`
 * Record. In case of any error, a `Left` is returned, containing the error
 * message.
 */
type JoinBothOptRows<A> = (rows: BothOptionalRows) => Either<string, A>

/**
 * `type LookupSheet :: String -> Either String [OrderedMap String String]`
 *
 * Looks up a worksheet from an XLSX file. Returns a `Left` with the error
 * message if not found or a `Right` with the worksheet, represented as a list
 * of maps.
 */
type LookupSheet = (sheet_id: string) => Either<string, Sheet>

const joinSheet =
  (lookup_sheet: LookupSheet) =>
  <A extends RecordWithId>
  (f: (row: OrderedMap<string, string>) => Either<string, Record<A>>) =>
  (sheet_name: string) =>
    pipe_ (
      sheet_name,
      lookup_sheet,
      bindF (mapM (f)),
      fmap (listToMapById)
    )

/**
 * `l10nRowsToMap :: RecordWithId a => LookupSheet -> JoinL10nRow a -> String -> Int -> Action (Either String (OrderedMap String a))`
 *
 * `l10nRowsToMap lookup_l10n make sheet_name phase` takes a
 * function to lookup a sheet from l10n table, a conversion function, the
 * required sheet's name and the phase. If any error occurs, which
 * is represented by a returned `Left` from `make`, the `Left` is returned by
 * this function, too. Otherwise, the loading phase is set to `phase` and the
 * `Right` of the map of created records is returned. It is used to make records
 * that only depend on l10n values, no universal values.
 */
export const l10nRowsToMap =
  (lookup_l10n: LookupSheet) =>
  <A extends RecordWithId>
  (f: JoinL10nRow<Record<A>>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, OrderedMap<string, Record<A>>>> =>
  dispatch => {
    const res = joinSheet (lookup_l10n) (f) (sheet_name)

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

/**
 * `univRowsToMap :: RecordWithId a => LookupSheet -> JoinUnivRow a -> String -> Int -> Action (Either String (OrderedMap String a))`
 *
 * `univRowsToMap lookup_univ make sheet_name phase` takes a
 * function to lookup a sheet from univ table, a conversion function, the
 * required sheet's name and the phase. If any error occurs, which
 * is represented by a returned `Left` from `make`, the `Left` is returned by
 * this function, too. Otherwise, the loading phase is set to `phase` and the
 * `Right` of the map of created records is returned. It is used to make records
 * that only depend on univ values, no language-specific values.
 */
export const univRowsToMap =
  (lookup_univ: LookupSheet) =>
  <A extends RecordWithId>
  (f: JoinUnivRow<Record<A>>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, OrderedMap<string, Record<A>>>> =>
  dispatch => {
    const res = joinSheet (lookup_univ) (f) (sheet_name)

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

const joinSheetsWithMatch =
  (lookup_other: LookupSheet) =>
  (lookup_main: LookupSheet) =>
  <A>
  (f: (other_sheet: List<OrderedMap<string, string>>) =>
      (main_sheet: OrderedMap<string, string>) => Either<string, Maybe<A>>) =>
  (sheet_name: string) =>
    pipe_ (
      sheet_name,
      lookup_other,
      bindF (other_sheet => pipe_ (
                              sheet_name,
                              lookup_main,
                              bindF (mapM (f (other_sheet)))
                            )),
      fmap (catMaybes)
    )

/**
 * `univRowsMatchL10nToList :: LookupSheet -> LookupSheet -> JoinUnivRowWithMatchingL10n a -> String -> Int -> Action (Either String [a])`
 *
 * `l10nRowToRecord lookup_l10n lookup_univ make sheet_name phase` takes a
 * function to lookup a sheet from l10n table, a function to lookup a sheet from
 * univ table, a conversion function, the required sheet's name and the phase.
 * If any error occurs, which is represented by a returned `Left` from `make`,
 * the `Left` is returned by this function, too. Otherwise, the loading phase is
 * set to `phase` and the `Right` of the list of created elements is returned.
 * It is used to make elements that require a row in univ table to work, like
 * spell extensions.
 */
export const univRowsMatchL10nToList =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: JoinUnivRowWithMatchingL10n<A>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, List<A>>> =>
  dispatch => {
    const res = joinSheetsWithMatch (lookup_l10n) (lookup_univ) (f) (sheet_name)

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

/**
 * `univRowsMatchL10nToList :: RecordWithId a => LookupSheet -> LookupSheet -> JoinUnivRowWithMatchingL10n a -> String -> Int -> Action (Either String (OrderedMap String a))`
 *
 * `l10nRowToRecord lookup_l10n lookup_univ make sheet_name phase` takes a
 * function to lookup a sheet from l10n table, a function to lookup a sheet from
 * univ table, a conversion function, the required sheet's name and the phase.
 * If any error occurs, which is represented by a returned `Left` from `make`,
 * the `Left` is returned by this function, too. Otherwise, the loading phase is
 * set to `phase` and the `Right` of the map of created records is returned. It
 * is used to make records that require a row in univ table to work, like
 * special abilities or skills.
 */
export const univRowsMatchL10nToMap =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A extends RecordWithId>
  (f: JoinUnivRowWithMatchingL10n<Record<A>>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, OrderedMap<string, Record<A>>>> =>
  dispatch => {
    const res = fmapF (joinSheetsWithMatch (lookup_l10n) (lookup_univ) (f) (sheet_name))
                      (listToMapById)

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

/**
 * `univRowsMatchL10nToList :: LookupSheet -> LookupSheet -> JoinUnivRowWithMatchingL10n a -> String -> Int -> Action (Either String [a])`
 *
 * `l10nRowToRecord lookup_l10n lookup_univ make sheet_name phase` takes a
 * function to lookup a sheet from l10n table, a function to lookup a sheet from
 * univ table, a conversion function, the required sheet's name and the phase.
 * If any error occurs, which is represented by a returned `Left` from `make`,
 * the `Left` is returned by this function, too. Otherwise, the loading phase is
 * set to `phase` and the `Right` of the list of created elements is returned.
 * It is used to make elements that require a row in l10n table to work, where
 * the univ part is optional, like for advantage selections.
 */
export const bothOptRowsByIdAndMainIdToList =
  (debug: boolean) =>
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: (debug: boolean) => JoinBothOptRows<A>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, List<A>>> =>
  dispatch => {
    if (debug) {
      console.log ("bothOptRowsByIdAndMainIdToList()")
    }

    const res =
      bind (liftM2 (joinBothOpt (debug))
                   (lookup_univ (sheet_name))
                   (lookup_l10n (sheet_name)))
           (mapM (f (debug)))

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

const joinBothOpt: (debug: boolean) =>
                   (univ_sheet: Sheet) =>
                   (l10n_sheet: Sheet) => List<BothOptionalRows> =
  debug => univ_sheet =>
    pipe (
      mapAccumL ((rem_univ_sheet: Sheet) =>
                 (l10n: Row): Pair<Sheet, BothOptionalRows> => {
                   const mmainId = lookup ("mainId") (l10n)
                   const mid = lookup ("id") (l10n)

                   // There must be both an id of the main entry and the id of
                   // the selection entry
                   if (isNothing (mmainId) || isNothing (mid)) {
                     return Pair (rem_univ_sheet, l10n)
                   }

                   traceShowIdWhen (debug) (l10n)

                   const mainId = fromJust (mmainId)
                   const id = fromJust (mid)

                   return maybe <Pair<Sheet, BothOptionalRows>>
                                // Return l10n row only if no matching univ row
                                // found
                                (Pair (rem_univ_sheet, l10n))
                                // Otherwise use the row at the passed index and
                                // merge both rows as a pair
                                ((i: number) => pipe_ (
                                  rem_univ_sheet,
                                  // Delete in remaining univ sheet
                                  deleteAtPair (i),
                                  p => maybe <Pair<Sheet, BothOptionalRows>>
                                             // if not found (which should not
                                             // be possible) return l10n row
                                             // only
                                             (Pair (rem_univ_sheet, l10n))
                                             // otherwise return both as a pair
                                             // l10n row must come first as required in type
                                             // BothOptionalRows
                                             ((univ: Row) => Pair (snd (p), Pair (l10n,
                                              traceShowIdWhen (debug) (univ))))
                                             (fst (p))
                                ))
                                // Search for a univ row that matches both
                                // mainId and id and return the index
                                (findIndex ((univ: Row) => elem (mainId) (lookup ("mainId") (univ))
                                                           && elem (id) (lookup ("id") (univ)))
                                           (rem_univ_sheet))
                 })
                 (univ_sheet),
       uncurry (append as append<BothOptionalRows>)
    )
