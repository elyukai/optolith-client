import { bindF, Either, isRight, mapM } from "../../../../Data/Either";
import { fmap, fmapF } from "../../../../Data/Functor";
import { List, map } from "../../../../Data/List";
import { catMaybes, Maybe } from "../../../../Data/Maybe";
import { fromList, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";
import { ReduxAction } from "../../../Actions/Actions";
import { setLoadingPhase } from "../../../Actions/IOActions";
import { Book } from "../../../Models/Wiki/Book";
import { pipe, pipe_ } from "../../pipe";

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
 * `type JoinUnivRowWithMatching :: [Map String String] -> Map String String -> Either String a`
 *
 * A converting function that takes a row from the current universal sheet and
 * all rows from the corresponding L10n sheet and converts into a `Right`
 * Record. In case of any error, a `Left` is returned, containing the error
 * message.
 */
type JoinUnivRowWithMatchingL10n<A> =
  (l10n: List<OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>) => Either<string, Maybe<A>>

/**
 * `type JoinUnivRowWithMatching :: [Map String String] -> Map String String -> Either String a`
 *
 * A converting function that takes a row from the current universal sheet and
 * all rows from the corresponding L10n sheet and converts into a `Right`
 * Record. In case of any error, a `Left` is returned, containing the error
 * message.
 */
type JoinL10nRowWithMatchingUniv<A> =
  (univ: List<OrderedMap<string, string>>) =>
  (l10n_row: OrderedMap<string, string>) => Either<string, Maybe<A>>

/**
 * `type LookupSheet :: String -> Either String [OrderedMap String String]`
 *
 * Looks up a worksheet from an XLSX file. Returns a `Left` with the error
 * message if not found or a `Right` with the worksheet, represented as a list
 * of maps.
 */
type LookupSheet = (sheet_id: string) => Either<string, List<OrderedMap<string, string>>>

/**
 * `l10nRowToRecord :: RecordWithId a => LookupSheet -> JoinL10nRow a -> String -> Int -> Action (Either String (OrderedMap String a))`
 *
 * `l10nRowToRecord lookup_l10n make sheet_name phase` takes a
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
    const res =
      pipe_ (
        sheet_name,
        lookup_l10n,
        bindF (mapM (f)),
        fmap (listToMapById)
      )

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

export const l10nRowsMatchUnivToList =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: JoinL10nRowWithMatchingUniv<A>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Either<string, List<A>>> =>
  dispatch => {
    const res = joinSheetsWithMatch (lookup_univ) (lookup_l10n) (f) (sheet_name)

    if (isRight (res)) {
      dispatch (setLoadingPhase (phase))
    }

    return res
  }

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
