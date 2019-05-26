import { Internals } from "../Data/Internals";
import { showP } from "../Data/Show";

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
    Internals.IO (async () => (console.log (`${msg} ${showP (x)}`), Promise.resolve (x)))

/**
 * `traceShow :: Show a => String -> a -> a`
 *
 * The `traceShow` function is a variant of the `trace` function that doesn't use
 * `IO` but only native JS-functions.
 */
export const traceShow = (msg: string) => <A> (x: A) => (console.log (`${msg} ${showP (x)}`), x)

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
    (console.log (`${msg} ${showP (f (x))}`), x)

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
  (x: A) => pred (x) ? (console.log (`${msg} ${showP (x)}`), x) : x
