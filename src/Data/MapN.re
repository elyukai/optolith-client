[@genType "OrderedMap"]
type t('k, 'a);

module Native = {
  [@bs.new] external make: array(('k, 'a)) => t('k, 'a) = "Map";

  [@bs.send] [@bs.return nullable]
  external get: (t('k, 'a), 'k) => option('a) = "get";

  [@bs.send] external has: (t('k, 'a), 'k) => bool = "has";

  [@bs.send]
  external entriesN: t('k, 'a) => Js.Array.array_like(('k, 'a)) = "entries";

  [@bs.send] external keysN: t('k, 'a) => Js.Array.array_like('k) = "keys";

  [@bs.send]
  external valuesN: t('k, 'a) => Js.Array.array_like('a) = "values";

  [@bs.send] external size: t('k, 'a) => int = "size";

  let entries = (x: t('k, 'a)): array(('k, 'a)) =>
    Js.Array.from(entriesN(x));

  let keys = (x: t('k, 'a)): array('k) => Js.Array.from(keysN(x));

  let values = (x: t('k, 'a)): array('a) => Js.Array.from(valuesN(x));
};

module Foldable = {
  let foldr = (f, initial, mp) =>
    mp
    |> Native.entries
    |> Js.Array.reduceRight((acc, (_, v)) => f(v, acc), initial);

  let foldl = (f, initial, mp) =>
    mp
    |> Native.entries
    |> Js.Array.reduce((acc, (_, v)) => f(acc, v), initial);

  let toList = mp => Array.to_list(Native.entries(mp));

  let null = mp => Native.size(mp) === 0;

  let length = Native.size;

  let elem = (e, mp) => mp |> Native.values |> Js.Array.some(x => x == e);

  let sum = mp => foldr((+), 0, mp);

  let product = mp => foldr(( * ), 1, mp);

  let maximum = mp => foldr(Js.Math.max_int, Js.Int.min, mp);

  let minimum = mp => foldr(Js.Math.min_int, Js.Int.max, mp);

  let concat = mp => foldl(List.append, [], mp);

  let concatMap = (f, mp) =>
    mp
    |> Native.entries
    |> Js.Array.reduce(
         (acc, (_, v)) => Js.Array.concat(acc, Native.entries(f(v))),
         [||],
       )
    |> Native.make;

  let con = mp => mp |> Native.values |> Js.Array.every(Function.id);

  let dis = mp => mp |> Native.values |> Js.Array.some(Function.id);

  let any = (pred, mp) => mp |> Native.values |> Js.Array.some(pred);

  let all = (pred, mp) => mp |> Native.values |> Js.Array.every(pred);

  let notElem = (e, mp) => !elem(e, mp);

  let find = (pred, mp) =>
    mp |> Native.values |> Js.Array.find(pred) |> Maybe.optionToMaybe;
};

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
    |> Either.Functor.(<$>)(xs => xs |> Array.of_list |> Native.make);
};

// QUERY

let size = Native.size;

let member = (key, mp) => mp |> Native.keys |> Js.Array.some(k => k == key);

let notMember = (key, mp) =>
  mp |> Native.keys |> Js.Array.some(k => k == key) |> (!);

let lookup = (key, mp) =>
  mp
  |> Native.entries
  |> Js.Array.find(((k, _)) => k == key)
  |> Maybe.optionToMaybe
  |> Maybe.Functor.(<$>)(snd);

let findWithDefault = (def, key, mp) =>
  mp |> lookup(key) |> Maybe.fromMaybe(def);
