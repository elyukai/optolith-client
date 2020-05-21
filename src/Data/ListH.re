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

module Index = {
  let%private rec indexedAux = (i, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => [(i, x), ...indexedAux(i + 1, xs)]
    };

  let indexed = xs => indexedAux(0, xs);

  let rec deleteAt = (index, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | [_, ...xs] when index === 0 => xs
        | [x, ...xs] => [x, ...deleteAt(index - 1, xs)]
        }
      );

  let rec setAt = (index, e, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | [_, ...xs] when index === 0 => [e, ...xs]
        | [x, ...xs] => [x, ...setAt(index - 1, e, xs)]
        }
      );

  let rec modifyAt = (index, f, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | [x, ...xs] when index === 0 => [f(x), ...xs]
        | [x, ...xs] => [x, ...modifyAt(index - 1, f, xs)]
        }
      );

  let rec updateAt = (index, f, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | [x, ...xs] when index === 0 =>
          Maybe.maybe(xs, x' => [x', ...xs], f(x))
        | [x, ...xs] => [x, ...updateAt(index - 1, f, xs)]
        }
      );

  let rec insertAt = (index, e, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | xs when index === 0 => [e, ...xs]
        | [x, ...xs] => [x, ...insertAt(index - 1, e, xs)]
        }
      );

  let%private rec imapAux = (f, i, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => [f(i, x), ...imapAux(f, i + 1, xs)]
    };

  let imap = (f, xs) => imapAux(f, 0, xs);
};

// Basic Functions

let (<+>) = (x, xs) => [x, ...xs];

// List transformations

let map = Functor.(<$>);

let reverse = xs => Foldable.foldl(Function.flip((<+>)), [], xs);

let rec intercalate = (separator, xs) =>
  switch (xs) {
  | [] => ""
  | [x] => x
  | [x, ...xs] => x ++ separator ++ intercalate(separator, xs)
  };

let%private permutationsPick = xs =>
  Index.imap((i, x) => (x, Index.deleteAt(i, xs)), xs);

let rec permutations = xs =>
  switch (xs) {
  | [] => []
  | [x] => [[x]]
  | xs =>
    xs
    |> permutationsPick
    |> Foldable.concatMap(((x', xs')) =>
         map((<+>)(x'), permutations(xs'))
       )
  };

// Searching Lists

let elem = Foldable.elem;

let notElem = Foldable.notElem;

let lookup = (k, xs) =>
  Maybe.Functor.(Foldable.find(((k', _)) => k == k', xs) <&> snd);

// Extracting sublists

/**
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
 */
let rec take = (n, xs) =>
  n <= 0
    ? []
    : (
      switch (xs) {
      | [] => []
      | [x, ...xs] => [x, ...take(n - 1, xs)]
      }
    );

// Predicates

/**
 * The `isInfixOf` function takes two strings and returns `True` if the first
 * string is contained, wholly and intact, anywhere within the second.
 *
 * ```haskell
 * >>> isInfixOf "Haskell" "I really like Haskell."
 * True
 * ```
 *
 * ```haskell
 * >>> isInfixOf "Ial" "I really like Haskell."
 * False
 * ```
 *
 */
let isInfixOf = (x: string, y: string) => Js.String.includes(y, x);

// Searching with a predicate

let filter = (pred, xs) =>
  Foldable.foldr(x => pred(x) ? (<+>)(x) : Function.id, [], xs);

let (!!) = List.nth;

let (<!!>) = (xs, i) => List.nth_opt(xs, i) |> Maybe.optionToMaybe;

// "Set" operations

/**
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
let rec delete = (e, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] => e == x ? xs : delete(e, xs)
  };

// Ordered lists

let sortBy = f => List.sort((a, b) => f(a, b) |> Ord.fromOrdering);

// Count by predicate

let countBy = (f, xs) =>
  Foldable.foldr(
    x =>
      if (f(x)) {
        Int.inc;
      } else {
        Function.id;
      },
    0,
    xs,
  );

module Extra = {
  /**
   * Convert a string to lower case.
   */
  let lower = str => String.lowercase_ascii(str);

  /**
   * A composition of `not` and `null`. Checks if a list has at least one
   * element.
   */
  let notNull = xs => xs |> Foldable.null |> (!);

  /**
   * Non-recursive transform over a list, like `maybe`.
   *
   * ```haskell
   * list 1 (\v _ -> v - 2) [5,6,7] == 3
   * list 1 (\v _ -> v - 2) []      == 1
   * nil cons xs -> maybe nil (uncurry cons) (uncons xs) == list nil cons xs
   * ```
   */
  let list = (def, f, xs) =>
    switch (xs) {
    | [] => def
    | [x, ...xs] => f(x, xs)
    };

  /**
   * If the list is empty returns `Nothing`, otherwise returns the `init` and
   * the `last`.
   */
  let rec unsnoc = xs =>
    Maybe.(
      switch (xs) {
      | [] => Nothing
      | [x] => Just(([], x))
      | [x, ...xs] =>
        switch (unsnoc(xs)) {
        | Just((a, b)) => Just((x <+> a, b))
        | Nothing => Nothing
        }
      }
    );

  /**
   * Escape a string that may contain `Regex`-specific notation for use in
   * regular expressions.
   *
   * ```haskell
   * escapeRegex "." == "\."
   * escapeRegex "This (or that)." == "This \(or that\)\."
   * ```
   */
  let escapeRegex =
    // $& means the whole matched string
    Js.String.replaceByRe([%re "/[.*+?^${}()|[\\]\\\\]/gu"], "\\$&");

  /**
   * Replace a subsequence everywhere it occurs. The first argument must not be
   * the empty string.
   */
  let replaceStr = (old_subseq: string, new_subseq: string, x: string) =>
    Js.String.replaceByRe(
      Js.Re.fromStringWithFlags(escapeRegex(old_subseq), ~flags="gu"),
      new_subseq,
      x,
    );
};
