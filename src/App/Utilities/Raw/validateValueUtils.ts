import { Either, first, fromRight_, isEither, isLeft, isRight, Left, Right, RightI } from "../../../Data/Either";
import { appendStr, List, notNullStr } from "../../../Data/List";
import { bindF, ensure, Maybe } from "../../../Data/Maybe";
import { showP } from "../../../Data/Show";
import { pipe_ } from "../pipe";
import { mensureMapNatural, mensureMapNaturalOptional, mensureMapNonEmptyString } from "./validateMapValueUtils";

export enum TableType { Univ, L10n }

const getTableTypeName = (x: TableType) => x === TableType.Univ ? `"univ.xlsx"` : `"l10n.xlsx"`

/**
 * Creates a shortcut for reuse when checking table data. Takes a function that
 * looks up a key, a function that validates the result from the first function
 * and the key and returns the result of the first function where a possible
 * error message is prepended by the name of the key.
 */
export const lookupKeyValid =
  <A> (validate: (x: Maybe<string>) => Either<string, A>) =>
  (tableType: TableType) =>
  (lookup: (key: string) => Maybe<string>) =>
  (key: string): Either<string, A> =>
    pipe_ (
      key,
      lookup,
      mstrToMaybe,
      validate,
      first (appendStr (`"${key}" in ${getTableTypeName (tableType)}: `))
    )

/**
 * Takes a `Maybe String` and returns `Nothing` if the string is empty,
 * otherwise a `Just` of the string.
 */
export const mstrToMaybe = bindF<string, string> (ensure (notNullStr))

interface AllEither {
  [key: string]: Either<string, any>
}

type MapRight<A extends AllEither> = {
  [K in keyof A]: RightI<Exclude<A[K], Left<any>>>
}

/**
 * Takes an object containing all values needed in `f` and validates every
 * value. If there is at least one `Left` value, the first is going to be
 * returned. Otherwise the result of `f` is returned, wrapped in a `Right`.
 */
export const mapMNamed =
  <A extends AllEither>
  (es: A) =>
  <B>
  (f: (rs: MapRight<A>) => B): Either<string, B> => {
    const rs =
      Object.entries (es)
        .reduce<Left<string> | MapRight<A>> (
          (rsAcc, [key, e]) =>
            isEither (rsAcc)
            ? rsAcc
            : isLeft (e)
            ? e
            : { ...rsAcc, [key]: fromRight_ (e) },
          {} as MapRight<A>
        )

    return isEither (rs) ? rs : Right (f (rs))
  }

/**
 * Takes an object containing all values needed in `f` and validates every
 * value. If there is at least one `Left` value, the first is going to be
 * returned. Otherwise the result of `f` is passed to `pred`, which result is
 * returned.
 */
export const mapMNamedPred =
  <B>
  (pred: (x: B) => Either<string, B>) =>
  <A extends AllEither>
  (es: A) =>
  (f: (rs: MapRight<A>) => B): Either<string, B> =>
    Either.bind (mapMNamed (es) (f)) (pred)

export const foldEitherPreds =
  <A>
  (preds: List<(x: A) => Either<string, A>>) =>
  (x: A): Either<string, A> => {
    let res = x

    for (const pred of preds) {
      const inter = pred (res)

      if (isRight (inter)) {
        res = fromRight_ (inter)
      }
      else {
        return inter
      }
    }

    return Right (res)
  }

export const mapTotalPred =
  (expected: string) => <A> (pred: (x: A) => boolean) => (x: A) =>
    pred (x)
      ? Right (x)
      : Left (`Expected: ${expected}, Received: ${showP (x)}`)

export const lookupKeyMapValidNonEmptyString =
  lookupKeyValid (mensureMapNonEmptyString)

export const lookupKeyMapValidNatural =
  lookupKeyValid (mensureMapNatural)

export const lookupKeyMapValidNaturalOptional =
  lookupKeyValid (mensureMapNaturalOptional)
