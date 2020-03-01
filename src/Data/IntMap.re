module IntMap = Map.Make(Int32);

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => IntMap.fold(f, mp, initial);
