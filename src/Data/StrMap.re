module StrMap = Map.Make(String);

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => StrMap.fold(f, mp, initial);
