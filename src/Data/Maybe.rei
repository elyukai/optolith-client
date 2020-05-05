[@gentype "Maybe"]
type t('a) =
  | Just('a)
  | Nothing;

[@gentype "Maybe_"]
type maybe('a) = t('a);

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
   * Takes a value and applies two functions that may fail (return `Nothing`).
   * Returns a `Just` of the result value or a `Nothing` if one of the functions
   * failed.
   */
  let (>=>): ('a => t('b), 'b => t('c), 'a) => t('c);

  /**
   * Removes one level of monadic structure.
   */
  [@genType "join"]
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
   *
   */
  let con: t(bool) => bool;

  /**
   *
   */
  let dis: t(bool) => bool;

  /**
   *
   */
  let any: ('a => bool, t('a)) => bool;

  /**
   *
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
   *
   */
  let sappend: (t(list('a)), t(list('a))) => t(list('a));
};

/**
 *
 */
let isJust: t('a) => bool;

/**
 *
 */
let isNothing: t('a) => bool;

/**
 *
 */
let fromMaybe: ('a, t('a)) => 'a;

/**
 *
 */
let maybe: ('a, 'b => 'a, t('b)) => 'a;

/**
 *
 */
let listToMaybe: list('a) => t('a);

/**
 *
 */
let maybeToList: t('a) => list('a);

/**
 *
 */
let catMaybes: list(t('a)) => list('a);

/**
 *
 */
let mapMaybe: ('a => t('b), list('a)) => list('b);

/**
 *
 */
[@genType]
let maybeToOption: t('a) => option('a);

/**
 *
 */
[@genType]
let optionToMaybe: option('a) => t('a);

let ensure: ('a => bool, 'a) => t('a);
