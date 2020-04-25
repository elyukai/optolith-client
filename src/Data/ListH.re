module Functor = {
  let rec (<$>) = (f, xs) =>
    switch (xs) {
    | [] => []
    | [y, ...ys] => [f(y), ...f <$> ys]
    };

  let (<&>) = (xs, f) => f <$> xs;
};

module Applicative = {
  open Functor;

  let rec (<*>) = (fs, xs) =>
    switch (fs) {
    | [] => []
    | gs =>
      switch (xs) {
      | [] => []
      | [x, ...ys] => ((f => f(x)) <$> gs) @ (fs <*> ys)
      }
    };
};

module Alternative = {
  let (<|>) = (xs, ys) =>
    switch (xs) {
    | [] => ys
    | xs => xs
    };

  let guard = pred => pred ? [()] : [];
};

module Monad = {
  open Function;
  open Functor;

  let rec (>>=) = (xs, f) =>
    switch (xs) {
    | [] => []
    | [y, ...ys] => f(y) @ (ys >>= f)
    };

  let (=<<) = (f, mx) => mx >>= f;

  let (>>) = (x, y) => x >>= const(y);

  let (>=>) = (f, g, x) => x->f >>= g;

  let join = x => x >>= id;

  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  let liftM4 = (f, mx, my, mz, ma) =>
    mx >>= (x => my >>= (y => mz >>= (z => f(x, y, z) <$> ma)));
};

module Foldable = {
  open Monad;

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

  let toList = (xs): list('a) => xs;

  let null = xs =>
    switch (xs) {
    | [] => true
    | _ => false
    };

  let length = xs => List.length(xs);

  let elem = (e, xs) => List.exists(x => e == x, xs);

  let sum = xs => foldr((+), 0, xs);

  let product = xs => foldr(( * ), 1, xs);

  let maximum = xs => foldr(Js.Math.max_int, Js.Int.min, xs);

  let minimum = xs => foldr(Js.Math.min_int, Js.Int.max, xs);

  let concat = xss => join(xss);

  let concatMap = (f, xs) => xs >>= f;

  let rec con = xs =>
    switch (xs) {
    | [] => true
    | [y, ...ys] => y && con(ys)
    };

  let rec dis = xs =>
    switch (xs) {
    | [] => false
    | [y, ...ys] => y || dis(ys)
    };

  let rec any = (f, xs) =>
    switch (xs) {
    | [] => false
    | [y, ...ys] => f(y) || any(f, ys)
    };

  let rec all = (f, xs) =>
    switch (xs) {
    | [] => true
    | [y, ...ys] => f(y) && all(f, ys)
    };

  let notElem = (e, xs) => !elem(e, xs);

  let rec find = (f, xs) =>
    switch (xs) {
    | [] => Maybe.Nothing
    | [y, ...ys] => f(y) ? Maybe.Just(y) : find(f, ys)
    };
};

// Basic Functions

let (<+>) = (x, xs) => [x, ...xs];

// List transformations

let map = Functor.(<$>);

// Searching Lists

let elem = Foldable.elem;

let notElem = Foldable.notElem;

let lookup = (k, xs) =>
  Maybe.Functor.(Foldable.find(((k', _)) => k == k', xs) <&> snd);
