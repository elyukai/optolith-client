module StrMap = Map.Make(String);

type t('a) = StrMap.t('a);

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => StrMap.fold(f, mp, initial);
