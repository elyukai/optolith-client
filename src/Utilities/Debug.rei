/**
 * `trace :: Show a => String -> a -> a`
 *
 * The `trace` function outputs the trace message given as its first argument,
 * before returning the second argument as its result.
 */
let trace: (string, 'a) => 'a;

/**
 * `traceId :: String -> String`
 *
 * Like `trace` but returns the message instead of a third value.
 */
let traceId: string => string;

/**
 * `traceShow :: Show a => a -> b -> b`
 *
 * Like `trace`, but uses `show` on the argument to convert it to a `String`.
 */
let traceShow: ('a, 'b) => 'b;

/**
 * `traceShowId :: Show a => a -> a`
 *
 * Like `traceShow` but returns the shown value instead of a third value.
 */
let traceShowId: 'a => 'a;

/**
 * `traceShowBoth :: Show a => a -> b -> b`
 *
 * A combination of `traceShow` and `traceShowId`. Prints both inputs to the
 * console and returns the second parameter.
 */
let traceShowBoth: ('a, 'b) => 'b;

/**
 * `traceShowIdWhen :: Show a => Bool -> a -> a`
 *
 * Like `traceShowId` but only prints to console if the passed boolean is
 * `True`.
 */
let traceShowIdWhen: (bool, 'a) => 'a;

let traceIdWith: ('a => 'b, 'a) => 'a;

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
let traceShowWith: (string, 'a => 'b, 'a) => 'a;

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
let traceShowIdWith: ('a => 'b, 'a) => 'a;

/**
 * `traceShowOn :: Show a => String -> a -> a`
 *
 * The `traceShowOn` function is a variant of the `trace` function that doesn't
 * use `IO` but only native JS-functions. It only shows a message if the
 * predicate returns `True`.
 */
let traceShowOn: ('a => bool, string, 'a) => 'a;
