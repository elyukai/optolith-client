module IntMap =
  Ley_Map.Make({
    type t = int;
    let compare = compare;
  });

include IntMap;
