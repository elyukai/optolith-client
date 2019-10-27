import { bindF, Either, mapM } from "../../../../Data/Either";
import { fmap, fmapF } from "../../../../Data/Functor";
import { List, map } from "../../../../Data/List";
import { catMaybes, Maybe } from "../../../../Data/Maybe";
import { fromList, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";
import { ReduxAction } from "../../../Actions/Actions";
import { setLoadingPhase } from "../../../Actions/IOActions";
import { Book } from "../../../Models/Wiki/Book";
import { pipe } from "../../pipe";

interface RecordWithId extends RecordIBase<any> {
  id: string
}

const { id } = Book.AL

const listToMap =
  pipe (map ((x: Record<RecordWithId>) => Pair (id (x), x)), fromList) as
    <A extends RecordWithId> (x0: List<Record<A>>) => OrderedMap<string, Record<A>>

type Convert<A> =
  (l10n: List<OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>) => Either<string, Maybe<A>>

type LookupSheet = (x0: string) => Either<string, List<OrderedMap<string, string>>>

export const lookupL10nToRecordFromSheet =
  (lookup_l10n: LookupSheet) =>
  <A extends RecordWithId>
  (f: (l10n_row: OrderedMap<string, string>) => Either<string, Record<A>>) =>
  async (sheet_name: string) => new Promise<Either<string, OrderedMap<string, Record<A>>>> (
    resolve => {
      const res = fmapF (bindF (mapM (f)) (lookup_l10n (sheet_name)))
                        (listToMap)

      resolve (res)
    }
  )

export const lookupL10nToRecordFromSheetLoading =
  (lookup_l10n: LookupSheet) =>
  <A extends RecordWithId>
  (f: (l10n_row: OrderedMap<string, string>) => Either<string, Record<A>>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Promise<Either<string, OrderedMap<string, Record<A>>>>> =>
  async dispatch => {
    const res = await lookupL10nToRecordFromSheet (lookup_l10n)
                                                  (f)
                                                  (sheet_name)

    dispatch (setLoadingPhase (phase))

    return res
  }

const lookupNoRequiredToRecordFromSheet =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: Convert<A>) =>
  async (sheet_name: string) => new Promise<Either<string, List<A>>> (
    resolve => {
      const res = bindF ((l10n: List<OrderedMap<string, string>>) =>
                          fmap<List<Maybe<A>>, List<A>> (catMaybes)
                                                        (bindF (mapM (f (l10n)))
                                                               (lookup_univ (sheet_name))))
                        (lookup_l10n (sheet_name))

      resolve (res)
    }
  )

export const lookupNoRequiredToRecordFromSheetLoading =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: Convert<A>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Promise<Either<string, List<A>>>> =>
  async dispatch => {
    const res = await lookupNoRequiredToRecordFromSheet (lookup_l10n)
                                                        (lookup_univ)
                                                        (f)
                                                        (sheet_name)

    dispatch (setLoadingPhase (phase))

    return res
  }

const lookupL10nRequiredToRecordFromSheet =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: Convert<A>) =>
  async (sheet_name: string) => new Promise<Either<string, List<A>>> (
    resolve => {
      const res = bindF ((univ: List<OrderedMap<string, string>>) =>
                          fmap<List<Maybe<A>>, List<A>> (catMaybes)
                                                        (bindF (mapM (f (univ)))
                                                               (lookup_l10n (sheet_name))))
                        (lookup_univ (sheet_name))

      resolve (res)
    }
  )

export const lookupL10nRequiredToRecordFromSheetLoading =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: Convert<A>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Promise<Either<string, List<A>>>> =>
  async dispatch => {
    const res = await lookupL10nRequiredToRecordFromSheet (lookup_l10n)
                                                          (lookup_univ)
                                                          (f)
                                                          (sheet_name)

    dispatch (setLoadingPhase (phase))

    return res
  }

export type ConvertL10nRequiredToRecordFromSheet =
  <A> (f: Convert<A>) => (sheet_name: string) => Promise<Either<string, List<A>>>

const lookupBothRequiredToRecordFromSheet =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A extends RecordWithId>
  (f: Convert<Record<A>>) =>
  async (sheet_name: string): Promise<Either<string, OrderedMap<string, Record<A>>>> =>
    fmap<List<Record<A>>, OrderedMap<string, Record<A>>>
      (listToMap)
      (await lookupNoRequiredToRecordFromSheet (lookup_l10n) (lookup_univ) (f) (sheet_name))

export const lookupBothRequiredToRecordFromSheetLoading =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A extends RecordWithId>
  (f: Convert<Record<A>>) =>
  (sheet_name: string) =>
  (phase: number): ReduxAction<Promise<Either<string, OrderedMap<string, Record<A>>>>> =>
  async dispatch => {
    const res = await lookupBothRequiredToRecordFromSheet (lookup_l10n)
                                                          (lookup_univ)
                                                          (f)
                                                          (sheet_name)

    dispatch (setLoadingPhase (phase))

    return res
  }
