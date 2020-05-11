module Functor = {
  let rec (<$>) = (f, xs) =>
    switch (xs) {
    | [] => []
    | [y, ...ys] => [f(y), ...f <$> ys]
    };

  [@genType]
  let fmap = (<$>);

  let (<&>) = (xs, f) => f <$> xs;

  [@genType]
  let fmapF = (<&>);
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

  [@genType]
  let ap = (<*>);
};

module Alternative = {
  let (<|>) = (xs, ys) =>
    switch (xs) {
    | [] => ys
    | xs => xs
    };

  [@genType]
  let alt = (<|>);

  [@genType]
  let guard = pred => pred ? [()] : [];
};

module Monad = {
  open Functor;
  open Ley_Function;

  let rec (>>=) = (xs, f) =>
    switch (xs) {
    | [] => []
    | [y, ...ys] => f(y) @ (ys >>= f)
    };

  [@genType]
  let bind = (>>=);

  let (=<<) = (f, mx) => mx >>= f;

  [@genType]
  let bindF = (=<<);

  let (>>) = (x, y) => x >>= const(y);

  [@genType "then"]
  let then_ = (>>);

  let (>=>) = (f, g, x) => x->f >>= g;

  [@genType]
  let kleisli = (>=>);

  [@genType]
  let join = x => x >>= id;

  [@genType]
  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  [@genType]
  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  [@genType]
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
  [@genType]
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
  [@genType]
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
  [@genType]
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
  [@genType]
  let foldl1 = (f, xs) =>
    switch (xs) {
    | [] => invalid_arg("Cannot apply foldl1 to an empty list.")
    | [y, ...ys] => foldl(f, y, ys)
    };

  [@genType]
  let toList = (xs): list('a) => xs;

  [@genType "fnull"]
  let null = xs =>
    switch (xs) {
    | [] => true
    | _ => false
    };

  [@genType "flength"]
  let length = xs => List.length(xs);

  [@genType]
  let elem = (e, xs) => List.exists(x => e == x, xs);

  [@genType]
  let sum = xs => foldr((+), 0, xs);

  [@genType]
  let product = xs => foldr(( * ), 1, xs);

  [@genType]
  let maximum = xs => foldr(Js.Math.max_int, Js.Int.min, xs);

  [@genType]
  let minimum = xs => foldr(Js.Math.min_int, Js.Int.max, xs);

  [@genType]
  let concat = xss => join(xss);

  [@genType]
  let concatMap = (f, xs) => xs >>= f;

  [@genType "and"]
  let rec con = xs =>
    switch (xs) {
    | [] => true
    | [y, ...ys] => y && con(ys)
    };

  [@genType "or"]
  let rec dis = xs =>
    switch (xs) {
    | [] => false
    | [y, ...ys] => y || dis(ys)
    };

  [@genType]
  let rec any = (f, xs) =>
    switch (xs) {
    | [] => false
    | [y, ...ys] => f(y) || any(f, ys)
    };

  [@genType]
  let rec all = (f, xs) =>
    switch (xs) {
    | [] => true
    | [y, ...ys] => f(y) && all(f, ys)
    };

  [@genType]
  let notElem = (e, xs) => !elem(e, xs);

  [@genType]
  let rec find = (f, xs) =>
    switch (xs) {
    | [] => None
    | [y, ...ys] => f(y) ? Some(y) : find(f, ys)
    };
};

module Index = {
  let%private rec indexedAux = (i, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => [(i, x), ...indexedAux(i + 1, xs)]
    };

  /**
   * `indexed` pairs each element with its index.
   *
   * ```haskell
   * >>> indexed "hello"
   * [(0,'h'),(1,'e'),(2,'l'),(3,'l'),(4,'o')]
   * ```
   */
  [@genType]
  let indexed = xs => indexedAux(0, xs);

  /**
   * `deleteAt` deletes the element at an index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  [@genType]
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

  /**
   * `deleteAtPair` deletes the element at an index and returns a `Just` of the
   * deleted element together with the remaining list.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned, together with `Nothing` representing no deleted element.
   */
  [@genType]
  let rec deleteAtPair = (index, xs) =>
    index < 0
      ? (None, xs)
      : (
        switch (xs) {
        | [] => (None, [])
        | [x, ...xs] when index === 0 => (Some(x), xs)
        | [x, ...xs] =>
          deleteAtPair(index - 1, xs)
          |> Ley_Tuple.Bifunctor.second(xs => [x, ...xs])
        }
      );

  /**
   * `setAt` sets the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  [@genType]
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

  /**
   * `modifyAt` applies a function to the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  [@genType]
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

  /**
   * `updateAt` applies a function to the element at the index, and then either
   * replaces the element or deletes it (if the function has returned
   * `Nothing`).
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  [@genType]
  let rec updateAt = (index, f, xs) =>
    index < 0
      ? xs
      : (
        switch (xs) {
        | [] => []
        | [x, ...xs] when index === 0 =>
          Ley_Option.option(xs, x' => [x', ...xs], f(x))
        | [x, ...xs] => [x, ...updateAt(index - 1, f, xs)]
        }
      );

  /**
   * `insertAt` inserts an element at the given position:
   *
   * `(insertAt i x xs) !! i == x`
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned. (If the index is equal to the list length, the insertion can be
   * carried out.)
   */
  [@genType]
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

  // Maps

  let rec imapAux = (f, i, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => [f(i, x), ...imapAux(f, i + 1, xs)]
    };

  /**
   * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  [@genType]
  let imap = (f, xs) => imapAux(f, 0, xs);

  // Folds

  let rec ifoldrAux = (f, index, acc, xs) =>
    switch (xs) {
    | [] => acc
    | [x, ...xs] => f(index, x, ifoldrAux(f, index + 1, acc, xs))
    };

  /**
   * Right-associative fold of a structure.
   */
  [@genType]
  let ifoldr = (f, initial, xs) => ifoldrAux(f, 0, initial, xs);

  let rec ifoldlAux = (f, index, acc, xs) =>
    switch (xs) {
    | [] => acc
    | [x, ...xs] => ifoldlAux(f, index + 1, f(acc, index, x), xs)
    };

  /**
   * Left-associative fold of a structure.
   */
  [@genType]
  let ifoldl = (f, initial, xs) => ifoldlAux(f, 0, initial, xs);

  let rec iallAux = (f, index, xs) =>
    switch (xs) {
    | [] => true
    | [x, ...xs] => f(index, x) && iallAux(f, index + 1, xs)
    };

  /**
   * Determines whether all elements of the structure satisfy the predicate.
   */
  [@genType]
  let iall = (f, xs) => iallAux(f, 0, xs);

  let rec ianyAux = (f, index, xs) =>
    switch (xs) {
    | [] => false
    | [x, ...xs] => f(index, x) || ianyAux(f, index + 1, xs)
    };

  /**
   * Determines whether any element of the structure satisfies the predicate.
   */
  [@genType]
  let iany = (f, xs) => ianyAux(f, 0, xs);

  let rec iconcatMapAux = (f, index, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => f(index, x) @ iconcatMapAux(f, index + 1, xs)
    };

  [@genType]
  let iconcatMap = (f, xs) => iconcatMapAux(f, 0, xs);

  /**
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  [@genType]
  let ifilter = (pred, xs) =>
    ifoldr((i, x, acc) => pred(i, x) ? [x, ...acc] : acc, [], xs);

  /**
   * The `ipartition` function takes a predicate a list and returns the pair of
   * lists of elements which do and do not satisfy the predicate, respectively.
   *
   * ```haskell
   * >>> partition (`elem` "aeiou") "Hello World!"
   * ("eoo","Hll Wrld!")
   * ```
   */
  [@genType]
  let ipartition = (pred, xs) =>
    ifoldr(
      (i, x) =>
        pred(i, x)
          ? Ley_Tuple.Bifunctor.first(acc => [x, ...acc])
          : Ley_Tuple.Bifunctor.second(acc => [x, ...acc]),
      ([], []),
      xs,
    );

  // Search

  let rec ifindAux = (pred, index, xs) =>
    switch (xs) {
    | [] => None
    | [x, ...xs] =>
      pred(index, x) ? Some(x) : ifindAux(pred, index + 1, xs)
    };

  /**
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  [@genType]
  let ifind = (pred, xs) => ifindAux(pred, 0, xs);

  let rec ifindIndexAux = (pred, index, xs) =>
    switch (xs) {
    | [] => None
    | [x, ...xs] =>
      pred(index, x) ? Some(index) : ifindIndexAux(pred, index + 1, xs)
    };

  /**
   * The `ifindIndex` function takes a predicate and a list and returns the
   * index of the first element in the list satisfying the predicate, or
   * `Nothing` if there is no such element.
   */
  [@genType]
  let ifindIndex = (pred, xs) => ifindIndexAux(pred, 0, xs);

  let rec ifindIndicesAux = (pred, i, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] =>
      pred(i, x)
        ? [i, ...ifindIndicesAux(pred, i + 1, xs)]
        : ifindIndicesAux(pred, i + 1, xs)
    };

  /**
   * The `findIndices` function extends `findIndex`, by returning the indices of
   * all elements satisfying the predicate, in ascending order.
   */
  [@genType]
  let ifindIndices = (pred, xs) => ifindIndicesAux(pred, 0, xs);
};

// Basic Functions

/**
 * Prepends an element to the list.
 */
let (<+>) = (x, xs) => [x, ...xs];

[@genType]
let cons = (<+>);

/**
 * Append two lists.
 */
let (++) = Pervasives.(@);

[@genType]
let append = (++);

/**
 * Extract the first element of a list, which must be non-empty.
 */
[@genType]
let head =
  fun
  | [] =>
    invalid_arg(
      "head does only work on non-empty lists. If you do not know whether the list is empty or not, use listToMaybe instead.",
    )
  | [x, ..._] => x;

/**
 * Extract the last element of a list, which must be finite and non-empty.
 */
[@genType]
let rec last =
  fun
  | [] => invalid_arg("last does only work on non-empty lists.")
  | [x, ...xs] =>
    switch (xs) {
    | [] => x
    | [_, ...xs] => last(xs)
    };

/**
 * Extract the elements after the head of a list, which must be non-empty.
 */
[@genType]
let tail =
  fun
  | [] => invalid_arg("tail does only work on non-empty lists.")
  | [_, ...xs] => xs;

/**
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
[@genType]
let rec init =
  fun
  | [] => invalid_arg("init does only work on non-empty lists.")
  | [x, ...xs] =>
    switch (xs) {
    | [] => []
    | _ => [x, ...init(xs)]
    };

/**
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
 */
[@genType]
let uncons =
  fun
  | [] => None
  | [x, ...xs] => Some((x, xs));

// List transformations

/**
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
[@genType]
let map = Functor.(<$>);

/**
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
[@genType]
let reverse = xs => Foldable.foldl(Ley_Function.flip((<+>)), [], xs);

/**
 * The intersperse function takes an element and a list and 'intersperses' that
 * element between the elements of the list. For example,
 *
 * ```haskell
 * intersperse ',' "abcde" == "a,b,c,d,e"
 * ```
 */
[@genType]
let rec intersperse = (sep, xs) =>
  switch (xs) {
  | [] => []
  | [x] => [x]
  | [x, ...xs] => [x, sep, ...intersperse(sep, xs)]
  };

/**
 * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
 * inserts the list `xs` in between the lists in `xss` and concatenates the
 * result.
 */
[@genType]
let rec intercalate = (separator, xs) =>
  switch (xs) {
  | [] => ""
  | [x] => x
  | [x, ...xs] =>
    x
    |> Pervasives.(++)(separator)
    |> Pervasives.(++)(intercalate(separator, xs))
  };

let%private permutationsPick = xs =>
  Index.imap((i, x) => (x, Index.deleteAt(i, xs)), xs);

/**
 * The `permutations` function returns the list of all permutations of the
 * argument.
 *
 * ```haskell
 * >>> permutations "abc"
 * ["abc","bac","cba","bca","cab","acb"]
 * ```
 *
 * If the given list is empty, an empty list is returned by this function.
 */
[@genType]
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

// Scans

/**
 * `scanl :: (b -> a -> b) -> b -> [a] -> [b]`
 *
 * scanl is similar to foldl, but returns a list of successive reduced values
 * from the left:
 *
 * ```scanl f z [x1, x2, ...] == [z, z `f` x1, (z `f` x1) `f` x2, ...]```
 *
 * Note that
 *
 * ```last (scanl f z xs) == foldl f z xs.```
 */
[@genType]
let rec scanl = (f, initial, xs) =>
  initial
  <+> (
    switch (xs) {
    | [] => []
    | [y, ...ys] => scanl(f, f(initial, y), ys)
    }
  );

// Accumulating Maps

/**
 * The `mapAccumL` function behaves like a combination of `fmap` and `foldl`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from left to right, and returning a final value of
 * this accumulator together with the new structure.
 */
[@genType]
let rec mapAccumL = (f, initial, ls) =>
  switch (ls) {
  | [] => (initial, [])
  | [x, ...xs] =>
    let (init, y) = f(initial, x);
    let (acc, ys) = mapAccumL(f, init, xs);
    (acc, [y, ...ys]);
  };

/**
 * The `mapAccumR` function behaves like a combination of `fmap` and `foldr`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from right to left, and returning a final value of
 * this accumulator together with the new structure.
 */
[@genType]
let rec mapAccumR = (f, initial, ls) =>
  switch (ls) {
  | [] => (initial, [])
  | [x, ...xs] =>
    let (init, ys) = mapAccumR(f, initial, xs);
    let (acc, y) = f(init, x);
    (acc, [y, ...ys]);
  };

// Infinite Lists

/**
 * `replicate n x` is a list of length `n` with `x` the value of every element.
 * It is an instance of the more general `genericReplicate`, in which `n` may be
 * of any integral type.
 */
[@genType]
let rec replicate = (len, x) => len > 0 ? x <+> replicate(len - 1, x) : [];

// Unfolding

/**
 * The `unfoldr` function is a 'dual' to `foldr`: while `foldr` reduces a list
 * to a summary value, `unfoldr` builds a list from a seed value. The function
 * takes the element and returns `Nothing` if it is done producing the list or
 * returns `Just (a,b)`, in which case, `a` is a prepended to the list and `b`
 * is used as the next element in a recursive call. For example,
 *
 * ```haskell
 * iterate f == unfoldr (\x -> Just (x, f x))
 * ```
 *
 * In some cases, unfoldr can undo a foldr operation:
 *
 * ```haskell
 * unfoldr f' (foldr f z xs) == xs
 * ```
 *
 * if the following holds:
 *
 * ```haskell
 * f' (f x y) = Just (x,y)
 * f' z       = Nothing
 * ```
 *
 * A simple use of unfoldr:
 *
 * ```haskell
 * >>> unfoldr (\b -> if b == 0 then Nothing else Just (b, b-1)) 10
 * [10,9,8,7,6,5,4,3,2,1]
 * ```
 */
[@genType]
let rec unfoldr = (f, seed) =>
  seed
  |> f
  |> (
    fun
    | Some((value, newSeed)) => value <+> unfoldr(f, newSeed)
    | None => []
  );

// Extracting sublists

/**
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
 */
[@genType]
let rec take = (n, xs) =>
  n <= 0
    ? []
    : (
      switch (xs) {
      | [] => []
      | [x, ...xs] => [x, ...take(n - 1, xs)]
      }
    );

/**
 * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
 * `[]` if `n > length x`.
 */
[@genType]
let rec drop = (n, xs) =>
  n <= 0
    ? xs
    : (
      switch (xs) {
      | [] => []
      | [_, ...xs] => drop(n - 1, xs)
      }
    );

/**
 * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
 * `n` and second element is the remainder of the list.
 */
[@genType]
let rec splitAt = (n, xs) =>
  n <= 0
    ? ([], xs)
    : (
      switch (xs) {
      | [] => ([], xs)
      | [x, ...xs] =>
        let (fsts, snds) = splitAt(n - 1, xs);
        ([x, ...fsts], snds);
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
[@genType]
let isInfixOf = (x: string, y: string) => Js.String.includes(y, x);

// Searching by equality

[@genType]
let elem = Foldable.elem;

[@genType]
let notElem = Foldable.notElem;

/**
 * `lookup key assocs` looks up a key in an association list.
 */
[@genType]
let lookup = (k, xs) =>
  Ley_Option.Functor.(Foldable.find(((k', _)) => k == k', xs) <&> snd);

// Searching with a predicate

/**
 * `filter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
[@genType]
let filter = (pred, xs) =>
  Foldable.foldr(x => pred(x) ? (<+>)(x) : Ley_Function.id, [], xs);

/**
 * The `partition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
 * ```haskell
 * >>> partition (`elem` "aeiou") "Hello World!"
 * ("eoo","Hll Wrld!")
 * ```
 */
[@genType]
let partition = (pred, xs) =>
  Foldable.foldr(
    x =>
      pred(x)
        ? Ley_Tuple.Bifunctor.first((<+>)(x))
        : Ley_Tuple.Bifunctor.second((<+>)(x)),
    ([], []),
    xs,
  );

// Indexing lists

/**
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * raises and expection, otherwise `a`.
 */
let (!!) = List.nth;

[@genType]
let subscript = (!!);

/**
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
 */
[@genType]
let rec elemIndex = (e, xs) =>
  switch (xs) {
  | [] => None
  | [x, ...xs] =>
    e == x
      ? Some(0) : Ley_Option.Functor.(<$>)(Ley_Int.inc, elemIndex(e, xs))
  };

let rec elemIndicesAux = (e, i, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] =>
    e == x
      ? [i, ...elemIndicesAux(e, i + 1, xs)] : elemIndicesAux(e, i + 1, xs)
  };

/**
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
 */
[@genType]
let elemIndices = (e, xs) => elemIndicesAux(e, 0, xs);

/**
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
 */
[@genType]
let rec findIndex = (pred, xs) =>
  switch (xs) {
  | [] => None
  | [x, ...xs] =>
    pred(x)
      ? Some(0) : Ley_Option.Functor.(<$>)(Ley_Int.inc, findIndex(pred, xs))
  };

let rec findIndicesAux = (pred, i, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] =>
    pred(x)
      ? [i, ...findIndicesAux(pred, i + 1, xs)]
      : findIndicesAux(pred, i + 1, xs)
  };

/**
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
 */
[@genType]
let findIndices = (pred, xs) => findIndicesAux(pred, 0, xs);

// Zipping and unzipping lists

/**
 * `zip` takes two lists and returns a list of corresponding pairs. If one
 * input list is short, excess elements of the longer list are discarded.
 */
[@genType]
let rec zip = (xs, ys) =>
  switch (xs, ys) {
  | ([x, ...xs], [y, ...ys]) => [(x, y), ...zip(xs, ys)]
  | _ => []
  };

/**
 * `zipWith` generalises `zip` by zipping with the function given as the first
 * argument, instead of a tupling function. For example, `zipWith (+)` is
 * applied to two lists to produce the list of corresponding sums.
 */
[@genType]
let rec zipWith = (f, xs, ys) =>
  switch (xs, ys) {
  | ([x, ...xs], [y, ...ys]) => [f(x, y), ...zipWith(f, xs, ys)]
  | _ => []
  };

// Special lists

// Functions on strings

/**
 * `lines` breaks a string up into a list of strings at newline characters. The
 * resulting strings do not contain newlines.
 *
 * Note that after splitting the string at newline characters, the last part of
 * the string is considered a line even if it doesn't end with a newline. For
 * example,
 *
 * ```haskell
 * >>> lines ""
 * []
 * ```
 *
 * ```haskell
 * >>> lines "\n"
 * [""]
 * ```
 *
 * ```haskell
 * >>> lines "one"
 * ["one"]
 * ```
 *
 * ```haskell
 * >>> lines "one\n"
 * ["one"]
 * ```
 *
 * ```haskell
 * >>> lines "one\n\n"
 * ["one",""]
 * ```
 *
 * ```haskell
 * >>> lines "one\ntwo"
 * ["one","two"]
 * ```
 *
 * ```haskell
 * >>> lines "one\ntwo\n"
 * ["one","two"]
 * ```
 *
 * Thus `lines s` contains at least as many elements as newlines in `s`.
 */
[@genType]
let lines = x =>
  Js.String.length(x) === 0
    ? []
    : x
      |> Js.String.replaceByRe([%re "/\\n$/u"], "")
      |> Js.String.splitByRe([%re "/\\n/u"])
      |> Array.to_list
      |> Ley_Option.catOptions;

// "Set" operations

/**
 * The `nub` function removes duplicate elements from a list. In particular, it
 * keeps only the first occurrence of each element. (The name `nub` means
 * 'essence'.) It is a special case of `nubBy`, which allows the programmer to
 * supply their own equality test.
 */
[@genType]
let nub = xs =>
  Foldable.foldr((x, acc) => notElem(x, acc) ? x <+> acc : acc, [], xs);

/**
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
[@genType "sdelete"]
let rec delete = (e, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] => e == x ? xs : delete(e, xs)
  };

/**
 * The `intersect` function takes the list intersection of two lists. For
 * example,
 *
 * ```haskell
 * >>> [1,2,3,4] `intersect` [2,4,6,8]
 * [2,4]
 * ```
 *
 * If the first list contains duplicates, so will the result.
 *
 * ```haskell
 * >>> [1,2,2,3,4] `intersect` [6,4,4,2]
 * [2,2,4]
 * ```
 *
 * It is a special case of `intersectBy`, which allows the programmer to supply
 * their own equality test. If the element is found in both the first and the
 * second list, the element from the first list will be used.
 */
[@genType]
let intersect = (xs, ys) => filter(Ley_Function.flip(elem, ys), xs);

// Ordered lists

/**
 * The `sortBy` function sorts all elements in the passed list using the passed
 * comparison function.
 */
[@genType]
let sortBy = f => List.sort((a, b) => f(a, b) |> Ley_Ord.fromOrdering);

/**
 * The largest element of a non-empty structure with respect to the given
 * comparison function.
 */
[@genType]
let maximumBy = (f, xs) =>
  Foldable.foldr1(
    (x, acc) =>
      f(x, acc)
      |> (
        fun
        | Ley_Ord.GT => x
        | EQ
        | LT => acc
      ),
    xs,
  );

/**
 * The least element of a non-empty structure with respect to the given
 * comparison function.
 */
[@genType]
let minimumBy = (f, xs) =>
  Foldable.foldr1(
    (x, acc) =>
      f(x, acc)
      |> (
        fun
        | Ley_Ord.LT => x
        | EQ
        | GT => acc
      ),
    xs,
  );

// Count by predicate

[@genType]
let countBy = (f, xs) =>
  Foldable.foldr(
    x =>
      if (f(x)) {
        Ley_Int.inc;
      } else {
        Ley_Function.id;
      },
    0,
    xs,
  );

// Lists and arrays

[@genType]
let listToArray = Array.of_list;

[@genType]
let arrayToList = Array.to_list;

module Extra = {
  /**
   * Convert a string to lower case.
   */
  [@genType]
  let lower = str => String.lowercase_ascii(str);

  /**
   * Remove spaces from the start of a string, see `trim`.
   */
  [@genType]
  let trimStart = str => str |> Js.String.replaceByRe([%re "/^\\s+/u"], "");

  /**
   * Remove spaces from the end of a string, see `trim`.
   */
  [@genType]
  let trimEnd = str => str |> Js.String.replaceByRe([%re "/\\s+$/u"], "");

  /**
   * Escape a string that may contain `Regex`-specific notation for use in
   * regular expressions.
   *
   * ```haskell
   * escapeRegex "." == "\."
   * escapeRegex "This (or that)." == "This \(or that\)\."
   * ```
   */
  [@genType]
  let escapeRegex =
    // $& means the whole matched string
    Js.String.replaceByRe([%re "/[.*+?^${}()|[\\]\\\\]/gu"], "\\$&");

  // Splitting

  /**
   * `splitOn :: (Partial, Eq a) => [a] -> [a] -> [[a]]`
   *
   * Break a list into pieces separated by the first list argument, consuming
   * the delimiter. An empty delimiter is invalid, and will cause an error to be
   * raised.
   */
  [@genType]
  let splitOn = (del, x) => Js.String.split(del, x) |> Array.to_list;

  // Basics

  /**
   * A composition of `not` and `null`: Checks if a list has at least one
   * element.
   */
  [@genType]
  let notNull = xs => xs |> Foldable.null |> (!);

  /**
   * A composition of `not` and `null`: Checks if a string is not empty.
   */
  [@genType]
  let notNullStr = xs => xs |> Js.String.length |> (<)(0);

  /**
   * Non-recursive transform over a list, like `maybe`.
   *
   * ```haskell
   * list 1 (\v _ -> v - 2) [5,6,7] == 3
   * list 1 (\v _ -> v - 2) []      == 1
   * nil cons xs -> maybe nil (uncurry cons) (uncons xs) == list nil cons xs
   * ```
   */
  [@genType]
  let list = (def, f, xs) =>
    switch (xs) {
    | [] => def
    | [x, ...xs] => f(x, xs)
    };

  /**
   * If the list is empty returns `Nothing`, otherwise returns the `init` and
   * the `last`.
   */
  [@genType]
  let rec unsnoc = xs =>
    switch (xs) {
    | [] => None
    | [x] => Some(([], x))
    | [x, ...xs] =>
      switch (unsnoc(xs)) {
      | Some((a, b)) => Some((x <+> a, b))
      | None => None
      }
    };

  /**
   * Append an element to the end of a list, takes *O(n)* time.
   */
  [@genType]
  let rec snoc = (xs, x) =>
    switch (xs) {
    | [] => [x]
    | [x, ...xs] => [x, ...snoc(xs, x)]
    };

  // List operations

  /**
   * A version of `maximum` where the comparison is done on some extracted
   * value.
   */
  let maximumOn = (f, xs) =>
    Foldable.foldr(
      (x, (m, max)) =>
        x |> f |> (res => res > max ? (Some(x), res) : (m, max)),
      (None, Js.Int.min),
      xs,
    )
    |> Ley_Tuple.fst;

  /**
   * A version of `minimum` where the comparison is done on some extracted
   * value.
   */
  let minimumOn = (f, xs) =>
    Foldable.foldr(
      (x, (m, min)) =>
        x |> f |> (res => res < min ? (Some(x), res) : (m, min)),
      (None, Js.Int.max),
      xs,
    )
    |> Ley_Tuple.fst;

  /**
   * Find the first element of a list for which the operation returns `Just`,
   * along with the result of the operation. Like `find` but useful where the
   * function also computes some expensive information that can be reused.
   * Particular useful when the function is monadic, see `firstJustM`.
   *
   * ```haskell
   * firstJust id [Nothing,Just 3]  == Just 3
   * firstJust id [Nothing,Nothing] == Nothing
   * ```
   */
  [@genType]
  let rec firstJust = (pred, xs) =>
    switch (xs) {
    | [] => None
    | [x, ...xs] =>
      switch (pred(x)) {
      | Some(_) as res => res
      | None => firstJust(pred, xs)
      }
    };

  /**
   * Replace a subsequence everywhere it occurs. The first argument must not be
   * the empty string.
   */
  [@genType]
  let replaceStr = (old_subseq: string, new_subseq: string, x: string) =>
    Js.String.replaceByRe(
      Js.Re.fromStringWithFlags(escapeRegex(old_subseq), ~flags="gu"),
      new_subseq,
      x,
    );

  /**
   * `replace :: (Partial, Eq a) => RegExp -> [a] -> [a] -> [a]`
   *
   * Replace a subsequence. Use the `g` flag on the `RegExp` to replace all
   * occurrences.
   */
  [@genType]
  let replaceStrRe = (old_subseq_rx, new_subseq: string, x: string) =>
    Js.String.replaceByRe(old_subseq_rx, new_subseq, x);
};

module Safe = {
  /**
   * Returns the element at the passed index. If the index is invalid (index
   * negative or index >= list length), `Nothing` is returned, otherwise a
   * `Just` of the found element.
   */
  [@genType]
  let atMay = (xs, i) => i < 0 ? None : List.nth_opt(xs, i);
};
