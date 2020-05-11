module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module Make = (Key: Comparable) => {
  type key = Key.t;

  module TypedMap = Map.Make(Key);

  type t('a) = TypedMap.t('a);

  module Foldable = {
    open Ley_Function;

    let foldr = (f, initial, mp) =>
      TypedMap.fold((_, v, acc) => f(v, acc), mp, initial);

    let foldl = (f, initial, mp) =>
      TypedMap.fold((_, v, acc) => f(acc, v), mp, initial);

    let toList = TypedMap.bindings;

    let null = mp => TypedMap.is_empty(mp);

    let length = TypedMap.cardinal;

    let elem = (e, mp) => TypedMap.exists((_, x) => e == x, mp);

    let sum = mp => foldr((+), 0, mp);

    let product = mp => foldr(( * ), 1, mp);

    let maximum = mp => foldr(Js.Math.max_int, Js.Int.min, mp);

    let minimum = mp => foldr(Js.Math.min_int, Js.Int.max, mp);

    let concat = mp => foldl(List.append, [], mp);

    let concatMap = (f, mp) =>
      TypedMap.fold(
        (_, v, acc) => TypedMap.union((_, x, _) => Some(x), acc, f(v)),
        mp,
        TypedMap.empty,
      );

    let con = mp => TypedMap.for_all(const(id), mp);

    let dis = mp => !TypedMap.for_all(const((!)), mp);

    let any = (pred, mp) =>
      !TypedMap.for_all((_, x) => x |> pred |> (!), mp);

    let all = (pred, mp) => TypedMap.for_all((_, x) => x |> pred, mp);

    let notElem = (e, mp) => !elem(e, mp);

    let find = (pred, mp) =>
      TypedMap.find_first_opt(
        key => key |> flip(TypedMap.find, mp) |> pred,
        mp,
      )
      |> Ley_Option.Functor.(<$>)(snd);
  };

  // QUERY

  let null = mp => TypedMap.is_empty(mp);

  let size = TypedMap.cardinal;

  let member = TypedMap.mem;

  let notMember = (key, mp) => !member(key, mp);

  let lookup = (key, mp) =>
    TypedMap.find_first_opt(k => Key.compare(k, key) === 0, mp)
    |> Ley_Option.Functor.(<$>)(snd);

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
    List.fold_right(((k, v)) => insert(k, v), ps, empty);

  let fromArray = ps =>
    Array.fold_right(((k, v)) => insert(k, v), ps, empty);

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

  // Counting

  let countBy = (f, xs) =>
    Ley_List.Foldable.foldr(
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
    Ley_List.Foldable.foldr(
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
    Ley_List.Foldable.foldr(
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

  module Traversable = {
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
      mp
      |> Foldable.toList
      |> mapMEitherHelper(f)
      |> Ley_Result.Functor.(<$>)(fromList);
  };
};
