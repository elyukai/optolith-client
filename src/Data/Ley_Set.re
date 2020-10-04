module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module type T = {
  type key;

  type t;

  let foldr: ((key, 'a) => 'a, 'a, t) => 'a;

  let foldl: (('a, key) => 'a, 'a, t) => 'a;

  let toList: t => list(key);

  let null: t => bool;

  let length: t => int;

  let elem: (key, t) => bool;

  let concatMap: (key => t, t) => t;

  let any: (key => bool, t) => bool;

  let all: (key => bool, t) => bool;

  let notElem: (key, t) => bool;

  let find: (key => bool, t) => option(key);

  // CONSTRUCTION

  let empty: t;

  let singleton: key => t;

  let fromList: list(key) => t;

  // INSERTION/DELETION

  let insert: (key, t) => t;

  let delete: (key, t) => t;

  let toggle: (key, t) => t;

  // QUERY

  let member: (key, t) => bool;

  let notMember: (key, t) => bool;

  let size: t => int;

  let disjoint: (t, t) => bool;

  // COMBINE

  /**
   * Excludes the items from both sets.
   */
  let union: (t, t) => t;

  /**
   * Excludes the items in the second set from the first.
   */
  let difference: (t, t) => t;

  // FILTER

  let filter: (key => bool, t) => t;

  // MAP

  let map: (key => key, t) => t;

  // CONVERSION LIST

  let elems: t => list(key);

  module Infix: {
    /**
     * `xs \/ ys` returns the set `xs` with all elements in `ys` removed from
     * `xs`.
     */
    let (\/): (t, t) => t;
  };
};

module Make = (Key: Comparable) : (T with type key = Key.t) => {
  type key = Key.t;

  module TypedSet = Set.Make(Key);

  type t = TypedSet.t;

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

  let any = (pred, s) => s |> TypedSet.for_all(x => x |> pred |> (!)) |> (!);

  let all = pred => TypedSet.for_all(x => x |> pred);

  let notElem = (x, s) => !elem(x, s);

  let find = (pred, s) => TypedSet.find_first_opt(pred, s);

  // CONSTRUCTION

  let empty = TypedSet.empty;

  let singleton = TypedSet.singleton;

  let fromList = TypedSet.of_list;

  // INSERTION/DELETION

  let insert = TypedSet.add;

  let delete = TypedSet.remove;

  let toggle = (x, s) => elem(x, s) ? delete(x, s) : insert(x, s);

  // QUERY

  let member = elem;

  let notMember = notElem;

  let size = length;

  let disjoint = (xs, ys) => TypedSet.inter(xs, ys) |> TypedSet.is_empty;

  // COMBINE

  let union = TypedSet.union;

  let difference = TypedSet.diff;

  // FILTER

  let filter = TypedSet.filter;

  // MAP

  let map = TypedSet.map;

  // CONVERSION LIST

  let elems = toList;

  module Infix = {
    let (\/) = difference;
  };
};
