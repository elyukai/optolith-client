module Str = {
  type t = string;
  let compare = compare;
};

module StrMap = Map.Make(Str);

include StrMap;

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => StrMap.fold(f, mp, initial);
