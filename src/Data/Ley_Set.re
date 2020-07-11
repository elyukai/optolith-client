module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module Make = (Key: Comparable) => {
  type key = Key.t;

  module TypedSet = Set.Make(Key);

  type t = TypedSet.t;

  module Foldable = {
    let foldr = (f, initial, s) => TypedSet.fold(f, s, initial);

    let foldl: (('a, key) => 'a, 'a, t) => 'a =
      (f, initial, s) => TypedSet.fold(Ley_Function.flip(f), s, initial);

    let toList = TypedSet.elements;

    let null = TypedSet.is_empty;

    let length = TypedSet.cardinal;

    let elem = x => TypedSet.exists(y => Key.compare(x, y) === 0);

    let concatMap = (f, s) =>
      TypedSet.fold(
        (x, acc) => TypedSet.union(acc, f(x)),
        s,
        TypedSet.empty,
      );

    let any = (pred, s) =>
      s |> TypedSet.for_all(x => x |> pred |> (!)) |> (!);

    let all = pred => TypedSet.for_all(x => x |> pred);

    let notElem = (x, s) => !elem(x, s);

    let find = (pred, s) => TypedSet.find_first_opt(pred, s);
  };

  // CONSTRUCTION

  let empty = TypedSet.empty;

  let singleton = TypedSet.singleton;

  let fromList = TypedSet.of_list;

  // INSERTION/DELETION

  let insert = TypedSet.add;

  let delete = TypedSet.remove;

  let toggle = (x, s) => Foldable.elem(x, s) ? delete(x, s) : insert(x, s);

  // QUERY

  let member = Foldable.elem;

  let notMember = Foldable.notElem;

  let size = Foldable.length;

  // COMBINE

  let union = TypedSet.union;

  let difference = TypedSet.diff;

  // FILTER

  let filter = TypedSet.filter;

  // MAP

  let map = TypedSet.map;

  // CONVERSION LIST

  let elems = Foldable.toList;
};
