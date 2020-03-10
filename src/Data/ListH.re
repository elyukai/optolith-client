module Functor = {
  let rec (<$>) = (f, xs) =>
    switch (xs) {
    | [] => []
    | [y, ...ys] => [f(y), ...f <$> ys]
    };
};

module Foldable = {
  /**
   * Right-associative fold of a structure.
   *
   * In the case of lists, `foldr`, when applied to a binary operator, a
   * starting value (typically the right-identity of the operator), and a list,
   * reduces the list using the binary operator, from right to left:
   *
   * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
   */
  let rec foldr = (f, initial, xs) =>
    switch (xs) {
    | [] => initial
    | [y, ...ys] => f(y, foldr(f, initial, ys))
    };

  /**
   * A variant of `foldr` that has no base case, and thus may only be applied to
   * non-empty structures.
   *
   * `foldr1 f = foldr1 f . toList`
   */
  let foldr1 = (f, xs) =>
    switch (xs) {
    | [] => invalid_arg("Cannot apply foldr1 to an empty list.")
    | [y, ...ys] => foldr(f, y, ys)
    };

  /**
   * Left-associative fold of a structure.
   *
   * In the case of lists, foldl, when applied to a binary operator, a starting
   * value (typically the left-identity of the operator), and a list, reduces
   * the list using the binary operator, from left to right:
   *
   * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
   */
  let rec foldl = (f, initial, xs) =>
    switch (xs) {
    | [] => initial
    | [y, ...ys] => foldl(f, f(initial, y), ys)
    };

  /**
   * `foldl1 :: (a -> a -> a) -> [a] -> a`
   *
   * A variant of `foldl` that has no base case, and thus may only be applied to
   * non-empty structures.
   *
   * `foldl1 f = foldl1 f . toList`
   */
  let foldl1 = (f, xs) =>
    switch (xs) {
    | [] => invalid_arg("Cannot apply foldl1 to an empty list.")
    | [y, ...ys] => foldl(f, y, ys)
    };
};

let map = Functor.(<$>);
