module IntMap =
  Ley_Map.Make({
    type t = int;
    let compare = (x, y) => y - x;
  });

include IntMap;
