module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module type T = {
  type key;

  type t('a);

  include Ley_Foldable.T with type t('a) := t('a);

  let mapMEither: ('a => result('b, 'c), t('a)) => result(t('b), 'c);

  let null: t('a) => bool;

  let size: t('a) => int;

  let member: (key, t('a)) => bool;

  let notMember: (key, t('a)) => bool;

  let lookup: (key, t('a)) => option('a);

  let findWithDefault: ('a, key, t('a)) => 'a;

  let empty: t('a);

  let singleton: (key, 'a) => t('a);

  let insert: (key, 'a, t('a)) => t('a);

  let insertWith: (('a, 'a) => 'a, key, 'a, t('a)) => t('a);

  let insertWithKey: ((key, 'a, 'a) => 'a, key, 'a, t('a)) => t('a);

  let insertLookupWithKey:
    ((key, 'a, 'a) => 'a, key, 'a, t('a)) => (option('a), t('a));

  let delete: (key, t('a)) => t('a);

  let adjust: ('a => 'a, key, t('a)) => t('a);

  let adjustWithKey: ((key, 'a) => 'a, key, t('a)) => t('a);

  let update: ('a => option('a), key, t('a)) => t('a);

  let updateWithKey: ((key, 'a) => option('a), key, t('a)) => t('a);

  let updateLookupWithKey:
    ((key, 'a) => option('a), key, t('a)) => (option('a), t('a));

  let alter: (option('a) => option('a), key, t('a)) => t('a);

  let union: (t('a), t('a)) => t('a);

  let map: ('a => 'b, t('a)) => t('b);

  let mapWithKey: ((key, 'a) => 'b, t('a)) => t('b);

  let foldrWithKey: ((key, 'a, 'b) => 'b, 'b, t('a)) => 'b;

  let foldlWithKey: (('a, key, 'b) => 'a, 'a, t('b)) => 'a;

  let elems: t('a) => list('a);

  let keys: t('a) => list(key);

  let assocs: t('a) => list((key, 'a));

  let fromList: list((key, 'a)) => t('a);

  let from_list_with: ('a => (key, 'b), list('a)) => t('b);

  let fromArray: array((key, 'a)) => t('a);

  let filter: ('a => bool, t('a)) => t('a);

  let filterWithKey: ((key, 'a) => bool, t('a)) => t('a);

  let mapMaybe: ('a => option('b), t('a)) => t('b);

  let mapMaybeWithKey: ((key, 'a) => option('b), t('a)) => t('b);

  // Zipping

  /**
     * `zip mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting map
     * contains only keys that are in both source maps and their values are a pair
     * of the values from the source maps.
     */
  let zip: (t('a), t('b)) => t(('a, 'b));

  /**
     * `zipOption mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting
     * map contains only keys that are in `mp1` and their values are a pair
     * of the values from `mp1` and the optional value from `mp2`, since the key
     * does not need to exist in `mp2`.
     */
  let zipOption: (t('a), t('b)) => t(('a, option('b)));

  // Counting

  /**
     * `countWith pred mp` takes a predicate function and a map. The predicate
     * is used to count elements based on if the predicate returns `true`.
     */
  let countWith: ('a => bool, t('a)) => int;

  /**
     * `countWithKey pred mp` takes a predicate function and a map. The
     * predicate is used to count elements based on if the predicate returns
     * `true`.
     */
  let countWithKey: ((key, 'a) => bool, t('a)) => int;

  /**
     * Takes a function and a list. The function is mapped over the list and the
     * return value is used as the key which's value is increased by one every
     * time the value is returned. This way, you can count elements grouped by
     * the value the mapping function returns.
     */
  let countBy: ('a => key, list('a)) => t(int);

  /**
     * Takes a function and a list. The function is mapped over the list and for
     * each `Just` it returns, the value at the key contained in the `Just` is
     * increased by one. This way, you can count elements grouped by the value
     * the mapping function returns, but you can also ignore values, which is
     * not possible with `countBy`.
     */
  let countByM: ('a => option(key), list('a)) => t(int);

  /**
     * `groupByKey f xs` groups the elements of the list `xs` by the key
     * returned by passing the respective element to `f` in a map.
     */
  let groupBy: ('a => key, list('a)) => t(list('a));
};

module Make = (Key: Comparable) : (T with type key = Key.t) => {
  type key = Key.t;

  module TypedMap = Map.Make(Key);

  type t('a) = TypedMap.t('a);

  include (
            Ley_Foldable.Make({
              type nonrec t('a) = t('a);

              let foldr = (f, initial, mp) =>
                TypedMap.fold((_, v, acc) => f(v, acc), mp, initial);

              let foldl = (f, initial, mp) =>
                TypedMap.fold((_, v, acc) => f(acc, v), mp, initial);
            }):
              Ley_Foldable.T with type t('a) := t('a)
          );

  // QUERY

  let null = mp => TypedMap.is_empty(mp);

  let size = TypedMap.cardinal;

  let member = TypedMap.mem;

  let notMember = (key, mp) => !member(key, mp);

  let lookup = (key, mp) =>
    TypedMap.find_first_opt(k => Key.compare(k, key) === 0, mp)
    |> Ley_Option.Infix.(<$>)(snd);

  let findWithDefault = (def, key, mp) =>
    mp |> lookup(key) |> Ley_Option.fromOption(def);

  // CONSTRUCTION

  let empty = TypedMap.empty;

  let singleton = TypedMap.singleton;

  // INSERTION

  let insert = TypedMap.add;

  let insertWith = (f, key, value, mp) =>
    insert(key, Ley_Option.option(value, f(value), lookup(key, mp)), mp);

  let insertWithKey = (f, key, value, mp) =>
    insert(
      key,
      Ley_Option.option(value, f(key, value), lookup(key, mp)),
      mp,
    );

  let insertLookupWithKey = (f, key, value, mp) => {
    let old = lookup(key, mp);

    (old, insert(key, Ley_Option.option(value, f(key, value), old), mp));
  };

  // DELETE/UPDATE

  let delete = TypedMap.remove;

  let adjust = (f, key, mp) =>
    TypedMap.update(
      key,
      mx =>
        switch (mx) {
        | Some(x) => Some(f(x))
        | None => None
        },
      mp,
    );

  let adjustWithKey = (f, key, mp) =>
    TypedMap.update(
      key,
      mx =>
        switch (mx) {
        | Some(x) => Some(f(key, x))
        | None => None
        },
      mp,
    );

  let update = (f, key, mp) =>
    TypedMap.update(
      key,
      mx =>
        switch (mx) {
        | Some(x) => f(x)
        | None => None
        },
      mp,
    );

  let updateWithKey = (f, key, mp) =>
    TypedMap.update(
      key,
      mx =>
        switch (mx) {
        | Some(x) => f(key, x)
        | None => None
        },
      mp,
    );

  let updateLookupWithKey = (f, key, mp) => {
    let old = lookup(key, mp);

    (
      old,
      TypedMap.update(
        key,
        mx =>
          switch (mx) {
          | Some(x) => f(key, x)
          | None => None
          },
        mp,
      ),
    );
  };

  let alter = (f, key, mp) => TypedMap.update(key, mx => mx |> f, mp);

  // COMBINE

  let union = (mp1, mp2) => TypedMap.union((_, x, _) => Some(x), mp1, mp2);

  // MAP

  let map = TypedMap.map;

  let mapWithKey = TypedMap.mapi;

  // FOLDS

  let foldrWithKey = (f, initial, mp) =>
    TypedMap.fold((key, v, acc) => f(key, v, acc), mp, initial);

  let foldlWithKey = (f, initial, mp) =>
    TypedMap.fold((key, v, acc) => f(acc, key, v), mp, initial);

  // CONVERSION

  let elems = mp => mp |> TypedMap.bindings |> List.map(snd);

  let keys = mp => mp |> TypedMap.bindings |> List.map(fst);

  let assocs = TypedMap.bindings;

  // let keysSet :: Map k a -> Set k;

  // let fromSet :: (k -> a) -> Set k -> Map k a;

  // LISTS

  let fromList = ps =>
    List.fold_left((mp, (k, v)) => insert(k, v, mp), empty, ps);

  let from_list_with = (f, ps) =>
    List.fold_left(
      (mp, x) => {
        let (k, v) = f(x);
        insert(k, v, mp);
      },
      empty,
      ps,
    );

  let fromArray = ps =>
    Array.fold_left((mp, (k, v)) => insert(k, v, mp), empty, ps);

  // FILTER

  let filter = (pred, mp) => TypedMap.filter((_, x) => pred(x), mp);

  let filterWithKey = TypedMap.filter;

  let mapMaybe = (f, mp) =>
    TypedMap.fold(
      (k, x, acc) =>
        switch (f(x)) {
        | Some(y) => insert(k, y, acc)
        | None => acc
        },
      mp,
      empty,
    );

  let mapMaybeWithKey = (f, mp) =>
    TypedMap.fold(
      (k, x, acc) =>
        switch (f(k, x)) {
        | Some(y) => insert(k, y, acc)
        | None => acc
        },
      mp,
      empty,
    );

  // Zipping

  /**
   * `zip mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting map
   * contains only keys that are in both source maps and their values are a pair
   * of the values from the source maps.
   */
  let zip = (mp1, mp2) =>
    mapMaybeWithKey(
      (k, v1) => Ley_Option.Infix.(Ley_Tuple.pair(v1) <$> lookup(k, mp2)),
      mp1,
    );

  /**
   * `zipOption mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting
   * map contains only keys that are in `mp1` and their values are a pair
   * of the values from `mp1` and the optional value from `mp2`, since the key
   * does not need to exist in `mp2`.
   */
  let zipOption = (mp1, mp2) =>
    mapWithKey((k, v1) => (v1, lookup(k, mp2)), mp1);

  // Counting

  let countWith = (pred, mp) =>
    foldr(x => pred(x) ? Ley_Int.inc : Ley_Function.id, 0, mp);

  let countWithKey = (pred, mp) =>
    foldrWithKey(
      (key, x) => pred(key, x) ? Ley_Int.inc : Ley_Function.id,
      0,
      mp,
    );

  let countBy = (f, xs) =>
    Ley_List.foldr(
      x =>
        x
        |> f
        |> alter(acc =>
             acc |> Ley_Option.option(1, Ley_Int.inc) |> (x => Some(x))
           ),
      empty,
      xs,
    );

  let countByM = (f, xs) =>
    Ley_List.foldr(
      x =>
        x
        |> f
        |> Ley_Option.option(Ley_Function.id, key =>
             alter(
               acc =>
                 acc |> Ley_Option.option(1, Ley_Int.inc) |> (x => Some(x)),
               key,
             )
           ),
      empty,
      xs,
    );

  let groupBy = (f, xs) =>
    Ley_List.foldr(
      x =>
        x
        |> f
        |> alter(acc =>
             acc
             |> Ley_Option.option([x], Ley_List.(<+>)(x))
             |> (x => Some(x))
           ),
      empty,
      xs,
    );

  let%private rec mapMEitherHelper = (f, xs) =>
    switch (xs) {
    | [] => Ok([])
    | [(k, v), ...ys] =>
      let new_value = f(v);

      switch (new_value) {
      | Ok(z) =>
        switch (mapMEitherHelper(f, ys)) {
        | Ok(zs) => Ok([(k, z), ...zs])
        | Error(l) => Error(l)
        }
      | Error(l) => Error(l)
      };
    };

  let mapMEither = (f, mp) =>
    mp |> assocs |> mapMEitherHelper(f) |> Ley_Result.Functor.(<$>)(fromList);
};
