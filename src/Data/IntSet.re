type key = int;

module IntSet =
  Set.Make({
    type t = key;
    let compare = compare;
  });

type t = IntSet.t;

type intset = t;

// CONSTRUCTION

let empty = IntSet.empty;

let singleton = IntSet.singleton;

let fromList = IntSet.of_list;
