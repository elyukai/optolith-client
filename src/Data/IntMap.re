module Int = {
  type t = int;
  let compare = compare;
};

module IntMap = Map.Make(Int);

include IntMap;

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => IntMap.fold(f, mp, initial);
