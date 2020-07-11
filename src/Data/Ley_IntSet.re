module IntSet =
  Ley_Set.Make({
    type t = int;
    let compare = (x, y) => y - x;
  });

include IntSet;
