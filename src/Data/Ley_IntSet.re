module IntSet =
  Ley_Set.Make({
    type t = int;
    let compare = compare;
  });

include IntSet;
