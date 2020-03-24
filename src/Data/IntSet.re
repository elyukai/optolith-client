type key = int;

module IntSet =
  Set.Make({
    type t = key;
    let compare = compare;
  });

type t = IntSet.t;

type intset = t;
