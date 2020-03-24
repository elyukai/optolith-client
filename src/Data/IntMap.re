type key = int;

module IntMap =
  Map.Make({
    type t = key;
    let compare = compare;
  });

type t('a) = IntMap.t('a);

type intmap('a) = t('a);

module Foldable = {
  open Function;

  let foldr = (f, initial, mp) =>
    IntMap.fold((_, v, acc) => f(v, acc), mp, initial);

  let foldl = (f, initial, mp) =>
    IntMap.fold((_, v, acc) => f(acc, v), mp, initial);

  let toList = IntMap.bindings;

  let null = mp => IntMap.is_empty(mp);

  let length = IntMap.cardinal;

  let elem = (e, mp) => IntMap.exists((_, x) => e == x, mp);

  let sum = mp => foldr((+), 0, mp);

  let product = mp => foldr(( * ), 1, mp);

  let maximum = mp => foldr(Js.Math.max_int, Js.Int.min, mp);

  let minimum = mp => foldr(Js.Math.min_int, Js.Int.max, mp);

  let concat = mp => foldl(List.append, [], mp);

  let concatMap = (f, mp) =>
    IntMap.fold(
      (_, v, acc) => IntMap.union((_, x, _) => Some(x), acc, f(v)),
      mp,
      IntMap.empty,
    );

  let con = mp => IntMap.for_all(const(id), mp);

  let dis = mp => !IntMap.for_all(const((!)), mp);

  let any = (pred, mp) => !IntMap.for_all((_, x) => x |> pred |> (!), mp);

  let all = (pred, mp) => IntMap.for_all((_, x) => x |> pred, mp);

  let notElem = (e, mp) => !elem(e, mp);

  let find = (pred, mp) =>
    IntMap.find_first_opt(key => key |> flip(IntMap.find, mp) |> pred, mp)
    |> Maybe.optionToMaybe
    |> Maybe.Functor.(<$>)(snd);
};

// QUERY

let size = IntMap.cardinal;

let member = IntMap.mem;

let notMember = (key, mp) => !member(key, mp);

let lookup = (key, mp) =>
  IntMap.find_first_opt(k => k == key, mp)
  |> Maybe.optionToMaybe
  |> Maybe.Functor.(<$>)(snd);

let findWithDefault = (def, key, mp) =>
  mp |> lookup(key) |> Maybe.fromMaybe(def);

// CONSTRUCTION

let empty = IntMap.empty;

let singleton = IntMap.singleton;

// INSERTION

let insert = IntMap.add;

let insertWith = (f, key, value, mp) =>
  insert(key, Maybe.maybe(value, f(value), lookup(key, mp)), mp);

let insertWithKey = (f, key, value, mp) =>
  insert(key, Maybe.maybe(value, f(key, value), lookup(key, mp)), mp);

let insertLookupWithKey = (f, key, value, mp) => {
  let old = lookup(key, mp);

  (old, insert(key, Maybe.maybe(value, f(key, value), old), mp));
};

// DELETE/UPDATE

let delete = IntMap.remove;

let adjust = (f, key, mp) =>
  IntMap.update(
    key,
    mx =>
      switch (mx) {
      | Some(x) => Some(f(x))
      | None => None
      },
    mp,
  );

let adjustWithKey = (f, key, mp) =>
  IntMap.update(
    key,
    mx =>
      switch (mx) {
      | Some(x) => Some(f(key, x))
      | None => None
      },
    mp,
  );

let update = (f, key, mp) =>
  IntMap.update(
    key,
    mx =>
      switch (mx) {
      | Some(x) => Maybe.maybeToOption(f(x))
      | None => None
      },
    mp,
  );

let updateWithKey = (f, key, mp) =>
  IntMap.update(
    key,
    mx =>
      switch (mx) {
      | Some(x) => Maybe.maybeToOption(f(key, x))
      | None => None
      },
    mp,
  );

let updateLookupWithKey = (f, key, mp) => {
  let old = lookup(key, mp);

  (
    old,
    IntMap.update(
      key,
      mx =>
        switch (mx) {
        | Some(x) => Maybe.maybeToOption(f(key, x))
        | None => None
        },
      mp,
    ),
  );
};

let alter = (f, key, mp) =>
  IntMap.update(
    key,
    mx => mx |> Maybe.optionToMaybe |> f |> Maybe.maybeToOption,
    mp,
  );

// COMBINE

let union = (mp1, mp2) => IntMap.union((_, x, _) => Some(x), mp1, mp2);

// MAP

let map = IntMap.map;

let mapWithKey = IntMap.mapi;

// FOLDS

let foldrWithKey = (f, initial, mp) =>
  IntMap.fold((key, v, acc) => f(key, v, acc), mp, initial);

let foldlWithKey = (f, initial, mp) =>
  IntMap.fold((key, v, acc) => f(acc, key, v), mp, initial);

// CONVERSION

let elems = mp => mp |> IntMap.bindings |> List.map(snd);

let keys = mp => mp |> IntMap.bindings |> List.map(fst);

let assocs = IntMap.bindings;

// let keysSet :: Map k a -> Set k;

// let fromSet :: (k -> a) -> Set k -> Map k a;

// LISTS

let fromList = ps => List.fold_right(((k, v)) => insert(k, v), ps, empty);

// FILTER

let filter = (pred, mp) => IntMap.filter((_, x) => pred(x), mp);

let filterWithKey = IntMap.filter;

let mapMaybe = (f, mp) =>
  IntMap.fold(
    (k, x, acc) =>
      switch (f(x)) {
      | Maybe.Just(y) => insert(k, y, acc)
      | Maybe.Nothing => acc
      },
    mp,
    empty,
  );

let mapMaybeWithKey = (f, mp) =>
  IntMap.fold(
    (k, x, acc) =>
      switch (f(k, x)) {
      | Maybe.Just(y) => insert(k, y, acc)
      | Maybe.Nothing => acc
      },
    mp,
    empty,
  );

module Traversable = {
  let%private rec mapMEitherHelper = (f, xs) =>
    switch (xs) {
    | [] => Either.Right([])
    | [(k, v), ...ys] =>
      let new_value = f(v);

      switch (new_value) {
      | Either.Right(z) =>
        switch (mapMEitherHelper(f, ys)) {
        | Right(zs) => Right([(k, z), ...zs])
        | Left(l) => Left(l)
        }
      | Left(l) => Left(l)
      };
    };

  let mapMEither = (f, mp) =>
    mp
    |> Foldable.toList
    |> mapMEitherHelper(f)
    |> Either.Functor.(<$>)(fromList);
};

module Experimental = {
  open Function;

  type height = int;

  /**
   * The lowest key is on the left.
   */
  type t('a) =
    | Bin(height, t('a), (key, 'a), t('a))
    | Tip;

  /**
   * Gets the height of a map. Does not recalculate the value.
   */
  let height = x =>
    switch (x) {
    | Bin(h, _, _, _) => h
    | Tip => 0
    };

  let bin = (l, p, r) => Bin(on(Int.max, height, l, r) + 1, l, p, r);

  /**
   * Returns the slope of the passed node. The "Slope" is the difference in
   * heights between the left and right subtrees of a node. A positive slope
   * means the right subtree is "higher" than the left subtree; zero if there is
   * no height difference.
   */
  let slope = x =>
    switch (x) {
    | Bin(_, tleft, _, tright) => height(tright) - height(tleft)
    | Tip => 0
    };

  /**
   * Before:
   *
   * ```txt
   *      x
   *     / \
   *    y   t3
   *   / \
   * t1   t2
   * ```
   *
   * where t1 has a greater height than t3 and t2 may have a greater height than
   * t3.
   *
   * After:
   *
   * ```txt
   *    y
   *   / \
   * t1   x
   *     / \
   *   t2   t3
   * ```
   */
  let rotateright = x =>
    switch (x) {
    | Bin(_, Bin(_, t1, x, t2), y, t3) => bin(t1, x, bin(t2, y, t3))
    | x => x
    };

  /**
   * Inverse of `rotateright`.
   */
  let rotateleft = x =>
    switch (x) {
    | Bin(_, t1, x, Bin(_, t2, y, t3)) => bin(bin(t1, x, t2), y, t3)
    | x => x
    };

  /**
   * Rebalances a tree. Assumes the subtrees are already balanced.
   */
  let rebalance = mp =>
    switch (mp) {
    | Tip => Tip
    | Bin(h, tleft, x, tright) =>
      let slope_main = slope(Bin(h, tleft, x, tright));

      // Dont do anything if most possible balanced and there is not more weight
      // on the right than on the left tree.
      if (slope_main === 0 || slope_main === (-1)) {
        Bin(h, tleft, x, tright);
      } else if
        // If left has too much weight, rotate right to compensate
        (slope_main === (-2)) {
        rotateright(Bin(h, tleft, x, tright));
      } else if
        // is right has too much weight and the right tree is exactly balanced,
        // rotate left to compensate
        (slope_main === 1 && slope(tright) === 0) {
        rotateleft(Bin(h, tleft, x, tright));
      } else {
        // otherwise, the right tree must have a heavier left subtree, so it needs
        // to be rotated right first before the main tree can be rotated left.
        rotateleft(
          Bin(h, tleft, x, rotateright(tright)),
        );
      };
    };

  let rec insert = (k, x, mp) =>
    switch (mp) {
    // if empty, create a single node with empty subtrees
    | Tip => Bin(1, Tip, (k, x), Tip)
    | Bin(h, tleft, (k0, x0), tright) =>
      if (k === k0) {
        Bin(h, tleft, (k, x), tright);
      } else if (k < k0) {
        rebalance(bin(insert(k, x, tleft), (k0, x0), tright));
      } else {
        rebalance(bin(tleft, (k0, x0), insert(k, x, tright)));
      }
    };

  /**
   * Right-associative fold of a structure.
   */
  let rec foldr = (f, initial, mp) =>
    switch (mp) {
    | Tip => initial
    | Bin(_, l, (_, x), r) => foldr(f, f(x, foldr(f, initial, r)), l)
    };

  /**
   * List of elements of a structure, from left to right.
   */
  let toList = mp => foldr((x, xs) => [x, ...xs], [], mp);

  let fromList = ps =>
    ListH.Foldable.foldr((p, mp) => insert(fst(p), snd(p), mp), Tip, ps);
};
