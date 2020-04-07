type key = int;

module IntSet =
  Set.Make({
    type t = key;
    let compare = compare;
  });

type t = IntSet.t;

type intset = t;

module Foldable = {
  let foldr = (f, initial, s) => IntSet.fold(f, s, initial);

  let foldl: (('a, key) => 'a, 'a, t) => 'a =
    (f, initial, s) => IntSet.fold(Function.flip(f), s, initial);

  let toList = IntSet.elements;

  let null = IntSet.is_empty;

  let length = IntSet.cardinal;

  let elem = x => IntSet.exists((==)(x));

  let sum = foldr((+), 0);

  let product = foldr(( * ), 1);

  let maximum = foldr(Js.Math.max_int, Js.Int.min);

  let minimum = foldr(Js.Math.min_int, Js.Int.max);

  let concatMap = (f, s) =>
    IntSet.fold((x, acc) => IntSet.union(acc, f(x)), s, IntSet.empty);

  let any = (pred, s) => s |> IntSet.for_all(x => x |> pred |> (!)) |> (!);

  let all = pred => IntSet.for_all(x => x |> pred);

  let notElem = (x, s) => !elem(x, s);

  let find = (pred, s) =>
    IntSet.find_first_opt(pred, s) |> Maybe.optionToMaybe;
};

// CONSTRUCTION

let empty = IntSet.empty;

let singleton = IntSet.singleton;

let fromList = IntSet.of_list;

// INSERTION/DELETION

let insert = IntSet.add;

let delete = IntSet.remove;

let toggle = (x, s) => Foldable.elem(x, s) ? delete(x, s) : insert(x, s);

// QUERY

let member = Foldable.elem;

let notMember = Foldable.notElem;

let size = Foldable.length;

// COMBINE

let union = IntSet.union;

let difference = IntSet.diff;

// FILTER

let filter = IntSet.filter;

// MAP

let map = IntSet.map;

// CONVERSION LIST

let elems = Foldable.toList;
