type t('a) = option('a);

include Ley_Functor.T with type t('a) := t('a);
include Ley_Applicative.T with type t('a) := t('a);
include Ley_Applicative.Alternative.T with type t('a) := t('a);
include Ley_Monad.T with type t('a) := t('a);
include Ley_Foldable.T with type t('a) := t('a);

/**
 * Concatenates the lists contained in the two `Maybe`s, if both are of
 * type `Just a`. If at least one of them is `Nothing`, it returns the first
 * element.
 */
let sappend: (t(list('a)), t(list('a))) => t(list('a));

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

module Infix: {
  include Ley_Functor.Infix with type t('a) := t('a);
  include Ley_Applicative.Infix with type t('a) := t('a);
  include Ley_Applicative.Alternative.Infix with type t('a) := t('a);
  include Ley_Monad.Infix with type t('a) := t('a);
};
