import { pipe } from "../App/Utilities/pipe";
import { Internals } from "../Data/Internals";
import { showP } from "../Data/Show";

/**
 * `trace :: Show a => String -> a -> a`
 *
 * The `trace` function outputs the trace message given as its first argument,
 * before returning the second argument as its result.
 */
export const trace = (msg: string) => <A> (x: A) => (console.log (msg), x)

/**
 * `traceId :: String -> String`
 *
 * Like `trace` but returns the message instead of a third value.
 */
export const traceId = (msg: string) => (console.log (msg), msg)

/**
 * `traceShow :: Show a => a -> b -> b`
 *
 * Like `trace`, but uses `show` on the argument to convert it to a `String`.
 */
export const traceShow = <A> (a: A) => <B> (b: B) => (console.log (showP (a)), b)

/**
 * `traceShowId :: Show a => a -> a`
 *
 * Like `traceShow` but returns the shown value instead of a third value.
 */
export const traceShowId = <A> (x: A) => (console.log (showP (x)), x)

/**
 * `traceShowBoth :: Show a => a -> b -> b`
 *
 * A combination of `traceShow` and `traceShowId`. Prints both inputs to the
 * console and returns the second parameter.
 */
export const traceShowBoth = <A> (a: A) => pipe (traceShow (a), traceShowId)

/**
 * `traceShowIdWhen :: Show a => Bool -> a -> a`
 *
 * Like `traceShowId` but only prints to console if the passed boolean is
 * `True`.
 */
export const traceShowIdWhen =
  (print: boolean) => <A> (x: A) => print ? (console.log (showP (x)), x) : x

export const traceIdWith = <A> (f: (x: A) => string) => (x: A): A => (console.log (f (x)), x)

/**
 * `traceWithN :: Show b => String -> (a -> b) -> a -> a`
 *
 * The `traceWithN msg f x` function takes a message `msg`, a function `f` and
 * an input `x`. It applies `x` to `f`, the result of `f` to `showP` and appends
 * the result of `showP` to the passed `msg`, which is then printed out to the
 * console. The actual input is returned by the function.
 *
 * This is useful to print a part of a structure to the console.
 *
 * The `traceWithN` function is a variant of the `traceWIth` function that
 * doesn't use `IO` but only native functions.
 */
export const traceShowWith =
  (msg: string) =>
  <A, B> (f: (x: A) => B) =>
  (x: A): A =>
    (console.log (concatMsgValue (msg) (f (x))), x)

/**
 * `traceShowIdWith :: Show b => (a -> b) -> a -> a`
 *
 * The `traceWithN msg f x` function takes a message `msg`, a function `f` and
 * an input `x`. It applies `x` to `f`, the result of `f` to `showP` and appends
 * the result of `showP` to the passed `msg`, which is then printed out to the
 * console. The actual input is returned by the function.
 *
 * This is useful to print a part of a structure to the console.
 *
 * The `traceWithN` function is a variant of the `traceWIth` function that
 * doesn't use `IO` but only native functions.
 */
export const traceShowIdWith: <A, B> (f: (x: A) => B) => (x: A) => A =
  f => x => (console.log (showP (f (x))), x)

/**
 * `traceShowOn :: Show a => String -> a -> a`
 *
 * The `traceShowOn` function is a variant of the `trace` function that doesn't
 * use `IO` but only native JS-functions. It only shows a message if the
 * predicate returns `True`.
 */
export const traceShowOn =
  <A> (pred: (x: A) => boolean) =>
  (msg: string) =>
  (x: A) => pred (x) ? (console.log (concatMsgValue (msg) (x)), x) : x

/**
 * `traceShowIO :: Show a => String -> a -> IO a`
 *
 * The `traceShowIO` function is a variant of the `print` function. It takes a
 * `String` and a showable value and returns an `IO`, that prints the String
 * concatenated with the value (a space in between) to the console and returns
 * the showable value.
 */
export const traceShowIO =
  (msg: string) =>
  <A> (x: A) =>
    Internals.IO (async () => (console.log (concatMsgValue (msg) (x)), Promise.resolve (x)))

const concatMsgValue = (msg: string) => (x: any) => `${insertSpaceNotNull (msg)}${showP (x)}`

const insertSpaceNotNull = (x: string) => x .length > 0 ? `${x} ` : ""
