import { Either, first, fromRight_, isEither, isLeft, Left, Right, RightI } from "../../../Data/Either";
import { appendStr, notNullStr } from "../../../Data/List";
import { bindF, ensure, Maybe } from "../../../Data/Maybe";
import { pipe } from "../pipe";
import { mensureMapNatural, mensureMapNaturalOptional, mensureMapNonEmptyString } from "./validateMapValueUtils";

export const Expect = Object.freeze ({
  NonEmptyString: "String (non-empty)",
  NaturalNumber: "Natural",
  Integer: "Int",
  Boolean: "Bool",
  Maybe: (x: string) => `Maybe ${x}`,
  List: (x: string) => `[${x}]`,
  ListLength: (len: number) => (x: string) => `[${x}] { length = ${len} }`,
  Pair: (x: string) => (y: string) => `(${x}, ${y})`,
  Union: (...xs: string[]) => xs .join (" | "),
  /** Group with `(` ...` )` */
  G: (x: string) => `(${x})`,
  Set: (x: string) => `Set ${x}`,
})

/**
 * Creates a shortcut for reuse when checking table data. Takes a function that
 * looks up a key, a function that validates the result from the first function
 * and the key and returns the result of the first function where a possible
 * error message is prepended by the name of the key.
 */
export const lookupKeyValid =
  <A> (validate: (x: Maybe<string>) => Either<string, A>) =>
  (lookup: (key: string) => Maybe<string>) =>
  (key: string): Either<string, A> =>
    pipe (lookup, mstrToMaybe, validate, first (appendStr (`"${key}": `))) (key)

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

    if (isEither (rs)) return rs

    return Right (f (rs))
  }

export const lookupKeyMapValidNonEmptyString =
  lookupKeyValid (mensureMapNonEmptyString)

export const lookupKeyMapValidNatural =
  lookupKeyValid (mensureMapNatural)

export const lookupKeyMapValidNaturalOptional =
  lookupKeyValid (mensureMapNaturalOptional)
