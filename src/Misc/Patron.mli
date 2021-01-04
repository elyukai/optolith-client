module Category : sig
  type t = { id : int; name : string; primaryPatronCultures : Ley_IntSet.t }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

type t = {
  id : int;
  name : string;
  category : int;
  skills : int * int * int;
  limitedToCultures : Ley_IntSet.t;
  isLimitedToCulturesReverse : bool;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
