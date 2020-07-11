type t('a) = option('a);

module Functor: {
  /**
   * Lift a function to apply to the wrapped value.
   */
  let (<$>): ('a => 'b, t('a)) => t('b);

  let (<&>): (t('a), 'a => 'b) => t('b);
};

module Applicative: {
  /**
   * Apply a wrapped function to a wrapped value.
   */
  let (<*>): (t('a => 'b), t('a)) => t('b);
};

module Alternative: {
  /**
   * Take the first if its a `Just`, otherwise the second.
   */
  let (<|>): (t('a), t('a)) => t('a);

  /**
   * Returns a `Nothing` on `false`, otherwise an empty `Just`.
   */
  let guard: bool => t(unit);
};

module Monad: {
  include (module type of Functor);

  /**
   * Lift a value.
   */
  let return: 'a => t('a);

  /**
   * Applies the function to the wrapped value and returns the return value.
   */
  let (>>=): (t('a), 'a => t('b)) => t('b);

  /**
   * Applies the function to the wrapped value and returns the return value.
   */
  let (=<<): ('a => t('b), t('a)) => t('b);

  /**
   * Returns the second if the first is a `Just`, otherwise `Nothing`.
   */
  let (>>): (t('a), t('b)) => t('b);

  /**
   * Maps a function over all values of the list. Returns a `Just` of the
   * results, if the function returned `Just`s for all elements. Otherwise
   * returns `Nothing`.
   */
  let mapM: ('b => t('a), list('b)) => t(list('a));

  /**
   * Takes a value and applies two functions that may fail (return `Nothing`).
   * Returns a `Just` of the result value or a `Nothing` if one of the functions
   * failed.
   */
  let (>=>): ('a => t('b), 'b => t('c), 'a) => t('c);

  /**
   * Removes one level of monadic structure.
   */
  let join: t(t('a)) => t('a);

  /**
   * Lift a function to be applied to two wrapped values and returns a `Just` of
   * the result if all values are `Just`s, otherwise `Nothing`.
   */
  let liftM2: (('a, 'b) => 'c, t('a), t('b)) => t('c);

  /**
   * Lift a function to be applied to three wrapped values and returns a `Just`
   * of the result if all values are `Just`s, otherwise `Nothing`.
   */
  let liftM3: (('a, 'b, 'c) => 'd, t('a), t('b), t('c)) => t('d);

  /**
   * Lift a function to be applied to four wrapped values and returns a `Just`
   * of the result if all values are `Just`s, otherwise `Nothing`.
   */
  let liftM4:
    (('a, 'b, 'c, 'd) => 'e, t('a), t('b), t('c), t('d)) => t('e);

  /**
   * Lift a function to be applied to five wrapped values and returns a `Just`
   * of the result if all values are `Just`s, otherwise `Nothing`.
   */
  let liftM5:
    (('a, 'b, 'c, 'd, 'e) => 'f, t('a), t('b), t('c), t('d), t('e)) =>
    t('f);
};

module Foldable: {
  /**
   *
   */
  let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

  /**
   *
   */
  let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;

  /**
   *
   */
  let toList: t('a) => list('a);

  /**
   *
   */
  let length: t('a) => int;

  /**
   *
   */
  let elem: ('a, t('a)) => bool;

  /**
   *
   */
  let sum: t(int) => int;

  /**
   *
   */
  let product: t(int) => int;

  /**
   *
   */
  let concat: t(list('a)) => list('a);

  /**
   *
   */
  let concatMap: ('a => list('b), t('a)) => list('b);

  /**
   * If the value is a `Some`, returns the contained value, otherwise `true`.
   */
  let con: t(bool) => bool;

  /**
   * If the value is a `Some`, returns the contained value, otherwise `false`.
   */
  let dis: t(bool) => bool;

  /**
   * If the passed `option` is a `Some`, returns the return value of the
   * predicate function applied to the contained value, otherwise `false`;
   */
  let any: ('a => bool, t('a)) => bool;

  /**
   * If the passed `option` is a `Some`, returns the return value of the
   * predicate function applied to the contained value, otherwise `true`;
   */
  let all: ('a => bool, t('a)) => bool;

  /**
   *
   */
  let notElem: ('a, t('a)) => bool;

  /**
   *
   */
  let find: ('a => bool, t('a)) => t('a);
};

module Semigroup: {
  /**
   * Concatenates the lists contained in the two `Maybe`s, if both are of
   * type `Just a`. If at least one of them is `Nothing`, it returns the first
   * element.
   */
  let sappend: (t(list('a)), t(list('a))) => t(list('a));
};

/**
 * Checks if the passed value is a `Just`.
 */
let isSome: t('a) => bool;

/**
 * Checks if the passed value is `Nothing`.
 */
let isNone: t('a) => bool;

/**
 * The `fromJust` function extracts the element out of a `Just` and throws an
 * error if its argument is `Nothing`.
 */
let fromSome: t('a) => 'a;

/**
 * The `fromMaybe` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 */
let fromOption: ('a, t('a)) => 'a;

/**
 * The `maybe` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 */
let option: ('a, 'b => 'a, t('b)) => 'a;

/**
 * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
 * where `a` is the first element of the list.
 */
let listToOption: list('a) => t('a);

/**
 * The `maybeToList` function returns an empty list when given `Nothing` or a
 * singleton list when not given `Nothing`.
 */
let optionToList: t('a) => list('a);

/**
 * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
 * the `Just` values.
 */
let catOptions: list(t('a)) => list('a);

/**
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
let mapOption: ('a => t('b), list('a)) => list('b);

// /**
//  * Convert a `Maybe` to a native `Option`.
//  */
// let maybeToOption: t('a) => option('a);

// /**
//  * Convert a native `Option` to a `Maybe`.
//  */
// let optionToMaybe: option('a) => t('a);

/**
 * Creates a new `Just a` from the given value if the given predicate
 * evaluates to `True`. Otherwise returns `Nothing`.
 */
let ensure: ('a => bool, 'a) => t('a);

/**
 * The `imapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 *
 * A version of `mapMaybe` so that the function receives the index of the
 * element as well.
 */
let imapOption: ((int, 'a) => t('b), list('a)) => list('b);

/**
 * `liftDef f x` applies the function `f` to `x`. If `f` returns a `Some`, it's
 * inner value is returned. If `f` returns `None`, `x` is returned unchanged.
 */
let liftDef: ('a => t('a), 'a) => 'a;
