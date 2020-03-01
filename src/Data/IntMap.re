module IntMap = Map.Make(Int32);

type t('a) = IntMap.t('a);

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => IntMap.fold(f, mp, initial);
