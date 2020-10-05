type t('a) = list('a);

include (
          Ley_Functor.Make({
            type nonrec t('a) = t('a);

            let rec fmap = (f, xs) =>
              switch (xs) {
              | [] => []
              | [y, ...ys] => [f(y), ...fmap(f, ys)]
              };
          }):
            Ley_Functor.T with type t('a) := t('a)
        );

include (
          Ley_Applicative.Make({
            type nonrec t('a) = t('a);

            let pure = x => [x];

            let fmap = fmap;

            let rec ap = (fs, xs) =>
              switch (fs) {
              | [] => []
              | gs =>
                switch (xs) {
                | [] => []
                | [x, ...ys] => fmap(f => f(x), gs) @ ap(fs, ys)
                }
              };
          }):
            Ley_Applicative.T with type t('a) := t('a)
        );

include (
          Ley_Applicative.Alternative.Make({
            type nonrec t('a) = t('a);

            let empty = [];

            let alt = (xs, ys) =>
              switch (xs) {
              | [] => ys
              | xs => xs
              };
          }):
            Ley_Applicative.Alternative.T with type t('a) := t('a)
        );

include (
          Ley_Monad.Make({
            type nonrec t('a) = t('a);

            let pure = pure;

            let fmap = fmap;

            let rec bind = (f, xs) =>
              switch (xs) {
              | [] => []
              | [y, ...ys] => f(y) @ bind(f, ys)
              };
          }):
            Ley_Monad.T with type t('a) := t('a)
        );

include (
          Ley_Foldable.Make({
            type nonrec t('a) = t('a);

            let rec foldr = (f, initial, xs) =>
              switch (xs) {
              | [] => initial
              | [y, ...ys] => f(y, foldr(f, initial, ys))
              };

            let rec foldl = (f, initial, xs) =>
              switch (xs) {
              | [] => initial
              | [y, ...ys] => foldl(f, f(initial, y), ys)
              };
          }):
            Ley_Foldable.T with type t('a) := t('a)
        );

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
  let indexed = xs => indexedAux(0, xs);

  /**
   * `deleteAt` deletes the element at an index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
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
  let ifoldr = (f, initial, xs) => ifoldrAux(f, 0, initial, xs);

  let rec ifoldlAux = (f, index, acc, xs) =>
    switch (xs) {
    | [] => acc
    | [x, ...xs] => ifoldlAux(f, index + 1, f(acc, index, x), xs)
    };

  /**
   * Left-associative fold of a structure.
   */
  let ifoldl = (f, initial, xs) => ifoldlAux(f, 0, initial, xs);

  let rec iallAux = (f, index, xs) =>
    switch (xs) {
    | [] => true
    | [x, ...xs] => f(index, x) && iallAux(f, index + 1, xs)
    };

  /**
   * Determines whether all elements of the structure satisfy the predicate.
   */
  let iall = (f, xs) => iallAux(f, 0, xs);

  let rec ianyAux = (f, index, xs) =>
    switch (xs) {
    | [] => false
    | [x, ...xs] => f(index, x) || ianyAux(f, index + 1, xs)
    };

  /**
   * Determines whether any element of the structure satisfies the predicate.
   */
  let iany = (f, xs) => ianyAux(f, 0, xs);

  let rec iconcatMapAux = (f, index, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] => f(index, x) @ iconcatMapAux(f, index + 1, xs)
    };

  let iconcatMap = (f, xs) => iconcatMapAux(f, 0, xs);

  /**
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
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
  let ifindIndices = (pred, xs) => ifindIndicesAux(pred, 0, xs);
};

// Basic Functions

/**
 * Prepends an element to the list.
 */
let (<+>) = (x, xs) => [x, ...xs];

let cons = (<+>);

/**
 * Append two lists.
 */
let (++) = Pervasives.(@);

let append = (++);

/**
 * Extract the first element of a list, which must be non-empty.
 */
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
let tail =
  fun
  | [] => invalid_arg("tail does only work on non-empty lists.")
  | [_, ...xs] => xs;

/**
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
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
let uncons =
  fun
  | [] => None
  | [x, ...xs] => Some((x, xs));

// List transformations

/**
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
let map = fmap;

/**
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
let reverse = xs => foldl(Ley_Function.flip((<+>)), [], xs);

/**
 * The intersperse function takes an element and a list and 'intersperses' that
 * element between the elements of the list. For example,
 *
 * ```haskell
 * intersperse ',' "abcde" == "a,b,c,d,e"
 * ```
 */
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
let rec permutations = xs =>
  switch (xs) {
  | [] => []
  | [x] => [[x]]
  | xs =>
    xs
    |> permutationsPick
    |> concatMap(((x', xs')) => map((<+>)(x'), permutations(xs')))
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
let isInfixOf = (x: string, y: string) => Js.String.includes(y, x);

// Searching by equality

let elem = elem;

let notElem = notElem;

/**
 * `lookup key assocs` looks up a key in an association list.
 */
let lookup = (k, xs) =>
  Ley_Option.Infix.(find(((k', _)) => k == k', xs) <&> snd);

// Searching with a predicate

/**
 * `filter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
let filter = (pred, xs) =>
  foldr(x => pred(x) ? (<+>)(x) : Ley_Function.id, [], xs);

/**
 * The `partition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
 * ```haskell
 * >>> partition (`elem` "aeiou") "Hello World!"
 * ("eoo","Hll Wrld!")
 * ```
 */
let partition = (pred, xs) =>
  foldr(
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

let subscript = (!!);

/**
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
 */
let rec elemIndex = (e, xs) =>
  switch (xs) {
  | [] => None
  | [x, ...xs] =>
    e == x ? Some(0) : Ley_Option.Infix.(<$>)(Ley_Int.inc, elemIndex(e, xs))
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
let elemIndices = (e, xs) => elemIndicesAux(e, 0, xs);

/**
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
 */
let rec findIndex = (pred, xs) =>
  switch (xs) {
  | [] => None
  | [x, ...xs] =>
    pred(x)
      ? Some(0) : Ley_Option.Infix.(<$>)(Ley_Int.inc, findIndex(pred, xs))
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
let findIndices = (pred, xs) => findIndicesAux(pred, 0, xs);

// Zipping and unzipping lists

/**
 * `zip` takes two lists and returns a list of corresponding pairs. If one
 * input list is short, excess elements of the longer list are discarded.
 */
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
let nub = xs =>
  foldr((x, acc) => notElem(x, acc) ? x <+> acc : acc, [], xs);

/**
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
let rec delete = (e, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] => e == x ? xs : delete(e, xs)
  };

/**
 * `xs \/ ys` returns the list `xs` with all elements in `ys` removed from `xs`.
 */
let (\/) = (xs, ys) => filter(Ley_Function.flip(notElem, ys), xs);

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
let intersect = (xs, ys) => filter(Ley_Function.flip(elem, ys), xs);

/**
 * `disjoint xs ys` checks if the lists `xs` and `ys` are disjoint (i.e., their
 * intersection is empty).
 */
let rec disjoint = (xs, ys) =>
  switch (xs, ys) {
  | ([], _)
  | (_, []) => true
  | (xs, [y, ...ys]) => notElem(y, xs) && disjoint(xs, ys)
  };

// Ordered lists

/**
 * The `sortBy` function sorts all elements in the passed list using the passed
 * comparison function.
 */
let sortBy = f => List.sort((a, b) => f(a, b) |> Ley_Ord.fromOrdering);

// /**
//  * The largest element of a non-empty structure with respect to the given
//  * comparison function.
//  */
// let maximumBy = (f, xs) =>
//   foldr1(
//     (x, acc) =>
//       f(x, acc)
//       |> (
//         fun
//         | Ley_Ord.GT => x
//         | EQ
//         | LT => acc
//       ),
//     xs,
//   );

// /**
//  * The least element of a non-empty structure with respect to the given
//  * comparison function.
//  */
// let minimumBy = (f, xs) =>
//   Foldable.foldr1(
//     (x, acc) =>
//       f(x, acc)
//       |> (
//         fun
//         | Ley_Ord.LT => x
//         | EQ
//         | GT => acc
//       ),
//     xs,
//   );

// Count by predicate

let countBy = (f, xs) =>
  foldr(
    x =>
      if (f(x)) {
        Ley_Int.inc;
      } else {
        Ley_Function.id;
      },
    0,
    xs,
  );

/**
 * `lengthMin min xs` checks if the list `xs` has a minimum length of `min`.
 */
let rec lengthMin = (min, xs) =>
  switch (xs) {
  | [] => min <= 0
  | [_, ...xs] => lengthMin(min - 1, xs)
  };

/**
 * `countMinBy pred min xs` checks if the elements of list `xs` match the
 * predicate `pred` a minimum of `min` times.
 */
let rec countMinBy = (pred, min, xs) =>
  switch (xs) {
  | [] => min <= 0
  | [x, ...xs] => min <= 0 || countMinBy(pred, pred(x) ? min - 1 : min, xs)
  };

/**
 * `countMin e min xs` checks if the element `e` occurs a minimum of `min` times
 * in list `xs`.
 */
let countMin = e => countMinBy((==)(e));

/**
 * `lengthMax max xs` checks if the list `xs` has a maximum length of `max`.
 */
let rec lengthMax = (max, xs) =>
  max < 0
    ? false
    : (
      switch (xs) {
      | [] => true
      | [_, ...xs] => lengthMax(max - 1, xs)
      }
    );

/**
 * `countMaxBy pred max xs` checks if the elements of list `xs` match the
 * predicate `pred` a maximum of `max` times.
 */
let rec countMaxBy = (pred, max, xs) =>
  max < 0
    ? false
    : (
      switch (xs) {
      | [] => true
      | [x, ...xs] => countMaxBy(pred, pred(x) ? max - 1 : max, xs)
      }
    );

/**
 * `countMax e max xs` checks if the element `e` occurs a maximum of `max` times
 * in list `xs`.
 */
let countMax = e => countMaxBy((==)(e));

/**
 * Returns if the passed lists have at least one value in common.
 */
let intersecting = (xs, ys) => any(x => elem(x, ys), xs);

// Lists and arrays

let listToArray = Array.of_list;

let arrayToList = Array.to_list;

module Extra = {
  /**
   * Convert a string to lower case.
   */
  let lower = str => String.lowercase_ascii(str);

  /**
   * Remove spaces from the start of a string, see `trim`.
   */
  let trimStart = str => str |> Js.String.replaceByRe([%re "/^\\s+/u"], "");

  /**
   * Remove spaces from the end of a string, see `trim`.
   */
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
  let splitOn = (del, x) => Js.String.split(del, x) |> Array.to_list;

  // Basics

  /**
   * A composition of `not` and `null`: Checks if a list has at least one
   * element.
   */
  let notNull = xs => xs |> null |> (!);

  /**
   * A composition of `not` and `null`: Checks if a string is not empty.
   */
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
    foldr(
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
    foldr(
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
  let replaceStrRe = (old_subseq_rx, new_subseq: string, x: string) =>
    Js.String.replaceByRe(old_subseq_rx, new_subseq, x);
};

module Safe = {
  /**
   * Returns the element at the passed index. If the index is invalid (index
   * negative or index >= list length), `Nothing` is returned, otherwise a
   * `Just` of the found element.
   */
  let atMay = (xs, i) => i < 0 ? None : List.nth_opt(xs, i);
};

module Infix = {
  include (
            Ley_Functor.MakeInfix({
              type nonrec t('a) = t('a);

              let fmap = fmap;
            }):
              Ley_Functor.Infix with type t('a) := t('a)
          );

  include (
            Ley_Applicative.MakeInfix({
              type nonrec t('a) = t('a);

              let pure = pure;

              let fmap = fmap;

              let rec ap = (fs, xs) =>
                switch (fs) {
                | [] => []
                | gs =>
                  switch (xs) {
                  | [] => []
                  | [x, ...ys] => fmap(f => f(x), gs) @ ap(fs, ys)
                  }
                };
            }):
              Ley_Applicative.Infix with type t('a) := t('a)
          );

  include (
            Ley_Applicative.Alternative.MakeInfix({
              type nonrec t('a) = t('a);

              let empty = [];

              let alt = (xs, ys) =>
                switch (xs) {
                | [] => ys
                | xs => xs
                };
            }):
              Ley_Applicative.Alternative.Infix with type t('a) := t('a)
          );

  include (
            Ley_Monad.MakeInfix({
              type nonrec t('a) = t('a);

              let pure = pure;

              let fmap = fmap;

              let rec bind = (f, xs) =>
                switch (xs) {
                | [] => []
                | [y, ...ys] => f(y) @ bind(f, ys)
                };
            }):
              Ley_Monad.Infix with type t('a) := t('a)
          );
};