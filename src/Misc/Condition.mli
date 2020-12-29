module Dynamic : sig
  type value = One | Two | Three | Four

  type t = { id : int; value : value }
end

module Static : sig
  type t = {
    id : int;
    name : string;
    description : string option;
    levelDescription : string option;
    levels : string * string * string * string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end
